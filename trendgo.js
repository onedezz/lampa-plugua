(function () {
    'use strict';

    // ==========================================
    // 1. КОНФІГУРАЦІЯ ТА СТАН
    // ==========================================
    const CONFIG = {
        CLIENT_ID: '28411c2510ddc138f76bc3e1022981f88e4402ad1b9e9e11e5d379667360bfdf', // Вкажіть ваш Client ID з Simkl API
        API_URL: 'https://api.simkl.com',
        PROXY_URL: 'https://cors.lamptv.workers.dev/?url=',
        STORAGE_KEY: 'simkl_account',
        PROGRESS_THROTTLE_MS: 90 * 1000
    };

    let state = {
        account: Lampa.Storage.get(CONFIG.STORAGE_KEY, {}),
        corsFree: detectCorsFree(),
        isCoolingDown: false,
        cooldownUntil: 0,
        inFlightRequests: new Map(),
        lastScrobbleTime: 0,
        lastScrobblePercent: 0
    };

    function detectCorsFree() {
        if (typeof window === 'undefined') return false;
        const protocol = window.location.protocol;
        return (
            protocol === 'file:' ||
            protocol === 'widget:' ||
            typeof LampaApp !== 'undefined' ||
            /Tizen|WebOS|SmartTV/i.test(navigator.userAgent)
        );
    }

    function getEndpointUrl(path, forceProxy = false) {
        const fullUrl = CONFIG.API_URL + (path.startsWith('/') ? path : '/' + path);
        if (!forceProxy && state.corsFree) {
            return fullUrl;
        }
        return CONFIG.PROXY_URL + encodeURIComponent(fullUrl);
    }

    // ==========================================
    // 2. ЯДРО МЕРЕЖЕВИХ ЗАПИТІВ (з обробкою CORS і RateLimit)
    // ==========================================
    async function apiRequest(path, options = {}) {
        const now = Date.now();
        if (state.isCoolingDown && now < state.cooldownUntil) {
            throw new Error(`Wait ${Math.ceil((state.cooldownUntil - now) / 1000)}s`);
        }

        const method = (options.method || 'GET').toUpperCase();
        const cacheKey = `${method}:${path}:${options.body ? JSON.stringify(options.body) : ''}`;

        if (method === 'GET' && state.inFlightRequests.has(cacheKey)) {
            return state.inFlightRequests.get(cacheKey);
        }

        const requestPromise = (async () => {
            const isAuthReq = path.includes('/oauth/');
            const url = getEndpointUrl(path, isAuthReq);

            const headers = {
                'Content-Type': 'application/json',
                'simkl-api-key': CONFIG.CLIENT_ID,
                ...(options.headers || {})
            };

            if (state.account.access_token && !isAuthReq) {
                headers['Authorization'] = `Bearer ${state.account.access_token}`;
            }

            let response;
            try {
                response = await fetch(url, {
                    method: method,
                    headers: headers,
                    body: options.body ? JSON.stringify(options.body) : null
                });
            } catch (err) {
                if (state.corsFree && !isAuthReq) {
                    state.corsFree = false;
                    return apiRequest(path, options);
                }
                throw err;
            }

            if (response.status === 429) {
                const retryAfter = parseInt(response.headers.get('Retry-After') || '30', 10);
                state.isCoolingDown = true;
                state.cooldownUntil = Date.now() + retryAfter * 1000;
                setTimeout(() => { state.isCoolingDown = false; }, retryAfter * 1000);
                throw new Error('Rate limit (429)');
            }

            if (response.status === 401) {
                clearAuth();
                Lampa.Bell.show({ text: 'Simkl: Потрібна авторизація.' });
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        })();

        if (method === 'GET') {
            state.inFlightRequests.set(cacheKey, requestPromise);
            requestPromise.finally(() => state.inFlightRequests.delete(cacheKey));
        }

        return requestPromise;
    }

    // ==========================================
    // 3. НОРМАЛІЗАЦІЯ ДАНИХ (Запобігає помилці forEach)
    // ==========================================
    function parseSimklToLampa(data) {
        let rawList = [];
        
        if (Array.isArray(data)) {
            rawList = data;
        } else if (data && typeof data === 'object') {
            rawList = data.movies || data.shows || data.anime || [];
        }

        if (!Array.isArray(rawList)) {
            return [];
        }

        return rawList.map(item => {
            const target = item.movie || item.show || item;
            const ids = target.ids || {};

            return {
                id: ids.tmdb || ids.simkl,
                simkl_id: ids.simkl,
                title: target.title || 'Без назви',
                name: target.title || 'Без назви',
                original_title: target.title,
                poster_path: target.poster ? `https://simkl.in/posters/${target.poster}_m.jpg` : '',
                img: target.poster ? `https://simkl.in/posters/${target.poster}_m.jpg` : '',
                year: target.year || '',
                release_date: target.year ? `${target.year}-01-01` : '',
                vote_average: target.ids?.simkl ? 0 : 0,
                type: item.show ? 'tv' : 'movie'
            };
        });
    }

    // ==========================================
    // 4. ПІДКТЮЧЕННЯ АКАУНТУ (PIN AUTH)
    // ==========================================
    async function startDeviceAuth() {
        try {
            const data = await apiRequest('/oauth/pin', {
                method: 'GET',
                headers: { 'simkl-api-key': CONFIG.CLIENT_ID }
            });

            if (!data || !data.user_code) {
                Lampa.Bell.show({ text: 'Не вдалося отримати код авторизації.' });
                return;
            }

            Lampa.Modal.open({
                title: 'Авторизація Simkl',
                html: `<div style="text-align: center; padding: 1.5em 1em;">
                    <p style="margin-bottom: 0.5em;">Відкрийте посилання: <b>simkl.com/pin</b></p>
                    <h1 style="font-size: 2.5em; letter-spacing: 2px; margin: 0.4em 0; color: #fff;">${data.user_code}</h1>
                    <p style="font-size: 0.9em; opacity: 0.7;">Введіть цей код у вашому профілі Simkl</p>
                </div>`,
                size: 'small',
                onBack: () => {
                    clearInterval(pollInterval);
                    Lampa.Modal.close();
                }
            });

            const pollInterval = setInterval(async () => {
                try {
                    const check = await apiRequest(`/oauth/pin/${data.user_code}?client_id=${CONFIG.CLIENT_ID}`);
                    if (check && check.result === 'OK' && check.access_token) {
                        clearInterval(pollInterval);
                        state.account = { access_token: check.access_token, created_at: Date.now() };
                        Lampa.Storage.set(CONFIG.STORAGE_KEY, state.account);
                        Lampa.Modal.close();
                        Lampa.Bell.show({ text: 'Simkl успішно підключено!' });
                    }
                } catch (e) {}
            }, 4000);

        } catch (e) {
            Lampa.Bell.show({ text: 'Помилка запуску авторизації' });
        }
    }

    function clearAuth() {
        state.account = {};
        Lampa.Storage.remove(CONFIG.STORAGE_KEY);
    }

    // ==========================================
    // 5. СКРОББЛІНГ І СИНХРОНІЗАЦІЯ
    // ==========================================
    const Scrobbler = {
        async sendProgress(card, progressPercent, eventType = 'watching') {
            if (!state.account.access_token || !card) return;

            const now = Date.now();
            const percentDiff = Math.abs(progressPercent - state.lastScrobblePercent);

            if (eventType === 'watching' && percentDiff < 5 && (now - state.lastScrobbleTime) < CONFIG.PROGRESS_THROTTLE_MS) {
                return;
            }

            const payload = card.number_of_seasons ? {
                shows: [{
                    ids: { tmdb: card.id },
                    seasons: [{
                        number: card.season || 1,
                        episodes: [{ number: card.episode || 1 }]
                    }]
                }],
                progress: Math.round(progressPercent)
            } : {
                movies: [{ ids: { tmdb: card.id } }],
                progress: Math.round(progressPercent)
            };

            const endpoint = eventType === 'stop' ? '/scrobble/stop' : '/scrobble/start';

            try {
                await apiRequest(endpoint, { method: 'POST', body: payload });
                state.lastScrobbleTime = now;
                state.lastScrobblePercent = progressPercent;
            } catch (err) {}
        }
    };

    // ==========================================
    // 6. КАТЕГОРІЯ З БЕЗПЕЧНИМ РЕНДЕРОМ
    // ==========================================
    function Component(object) {
        let network = new Lampa.Reguest();
        let scroll = new Lampa.Scroll({ mask: true, over: true });
        let items = [];
        let html = $('<div></div>');
        let body = $('<div class="category-full"></div>');

        this.create = function () {
            this.activity.loader(true);

            const endpoint = object.url || '/sync/all-items/movies/watching';
            
            apiRequest(endpoint)
                .then(response => {
                    items = parseSimklToLampa(response); // Гарантовано віддає Array
                    
                    this.activity.loader(false);

                    if (items.length === 0) {
                        let empty = Lampa.Template.get('empty', { title: 'Порожньо', text: 'У цьому списку немає елементів' });
                        html.append(empty);
                    } else {
                        scroll.minus();
                        html.append(scroll.render());
                        scroll.append(body);

                        items.forEach(item => {
                            let card = Lampa.Template.get('card', item);
                            card.on('hover:enter', () => {
                                Lampa.Activity.push({
                                    url: '',
                                    component: 'full',
                                    id: item.id,
                                    method: item.type === 'tv' ? 'tv' : 'movie',
                                    card: item
                                });
                            });
                            body.append(card);
                        });
                    }

                    this.activity.toggle();
                })
                .catch(err => {
                    this.activity.loader(false);
                    let empty = Lampa.Template.get('empty', { title: 'Помилка', text: 'Не вдалося завантажити список Simkl' });
                    html.append(empty);
                    this.activity.toggle();
                });

            return html;
        };

        this.start = function () {
            Lampa.Controller.add('content', {
                toggle: () => {
                    let cards = body.find('.card');
                    if (cards.length) Lampa.Controller.collectionSet(body);
                    else Lampa.Controller.collectionClear();
                },
                left: () => Lampa.Controller.move('left'),
                right: () => Lampa.Controller.move('right'),
                up: () => Lampa.Controller.move('up'),
                down: () => Lampa.Controller.move('down'),
                back: () => Lampa.Activity.backward()
            });
            Lampa.Controller.toggle('content');
        };

        this.pause = function () {};
        this.stop = function () {};
        this.destroy = function () {
            network.clear();
            scroll.destroy();
            html.remove();
        };
    }

    // ==========================================
    // 7. ІНІЦІАЛІЗАЦІЯ В LAMPA
    // ==========================================
    function startPlugin() {
        Lampa.Component.add('simkl_watchlist', Component);

        // Подієві слухачі плеєра
        Lampa.Player.listener.follow('timeupdate', (e) => {
            if (e.duration > 0) {
                const percent = (e.time / e.duration) * 100;
                Scrobbler.sendProgress(Lampa.Player.data(), percent, 'watching');
            }
        });

        Lampa.Player.listener.follow('destroy', () => {
            const data = Lampa.Player.data();
            if (data) {
                Scrobbler.sendProgress(data, state.lastScrobblePercent, 'stop');
            }
        });

        // Меню налаштувань Lampa
        Lampa.Settings.listener.follow('open', (e) => {
            if (e.name === 'main') {
                const item = $(`<div class="settings-param selector" data-action="simkl_auth">
                    <div class="settings-param__name">Simkl API</div>
                    <div class="settings-param__value">${state.account.access_token ? 'Підключено' : 'Підключити'}</div>
                </div>`);

                item.on('hover:enter', () => {
                    if (state.account.access_token) {
                        clearAuth();
                        item.find('.settings-param__value').text('Підключити');
                        Lampa.Bell.show({ text: 'Акаунт Simkl відключено' });
                    } else {
                        startDeviceAuth();
                    }
                });

                e.body.find('[data-action="account"]').after(item);
            }
        });
    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', (e) => {
            if (e.type === 'ready') startPlugin();
        });
    }
})();
