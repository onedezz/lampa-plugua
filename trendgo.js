(function () {
    'use strict';

    // ==========================================
    // 1. КОНФІГУРАЦІЯ ТА КОНСТАНТИ SIMKL API
    // ==========================================
    const CONFIG = {
        CLIENT_ID: 'YOUR_SIMKL_CLIENT_ID', // Вкажіть ваші реєстраційні дані Simkl
        CLIENT_SECRET: 'YOUR_SIMKL_CLIENT_SECRET',
        API_URL: 'https://api.simkl.com',
        PROXY_URL: 'https://cors.lamptv.workers.dev/?url=', // Або ваш проксі-сервер
        STORAGE_KEY: 'simkl_account',
        TOKEN_SKEW_MS: 2 * 60 * 1000, // 2 хвилини запасу для токера
        MAX_RETRIES: 3,
        PROGRESS_THROTTLE_MS: 90 * 1000 // 90 секунд між відправками прогресу
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

    // ==========================================
    // 2. ДЕТЕКЦІЯ СЕРЕДОВИЩА (CORS / DIRECT)
    // ==========================================
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
    // 3. СМАРТ-МАРШРУТИЗАТОР ЗАПИТІВ (NETWORK CORE)
    // ==========================================
    async function apiRequest(path, options = {}) {
        const now = Date.now();
        if (state.isCoolingDown && now < state.cooldownUntil) {
            throw new Error(`Rate limit cooldown in effect. Wait ${Math.ceil((state.cooldownUntil - now) / 1000)}s`);
        }

        const method = (options.method || 'GET').toUpperCase();
        const cacheKey = `${method}:${path}:${options.body ? JSON.stringify(options.body) : ''}`;

        // Deduplication для GET-запитів
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
                // Fallback: якщо упав direct-запит через CORS, перемикаємося на проксі
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
                throw new Error(`Simkl Rate Limit (429). Retry after ${retryAfter}s`);
            }

            if (response.status === 401) {
                clearAuth();
                Lampa.Bell.show({ text: 'Simkl: Сесія закінчилася. Авторизуйтесь знову.' });
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                throw new Error(`Simkl API Error: ${response.status}`);
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
    // 4. АВТОРИЗАЦІЯ (OAUTH / USER CODE)
    // ==========================================
    async function startDeviceAuth() {
        try {
            const data = await apiRequest('/oauth/pin', {
                method: 'GET',
                headers: { 'simkl-api-key': CONFIG.CLIENT_ID }
            });

            Lampa.Modal.open({
                title: 'Авторизація Simkl',
                html: `<div style="text-align: center; padding: 1em;">
                    <p>Перейдіть на сайт <b>https://simkl.com/pin</b></p>
                    <h2 style="font-size: 2em; margin: 0.5em 0;">${data.user_code}</h2>
                    <p>Та введіть цей код для підключення акаунту.</p>
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
                    if (check.result === 'OK' && check.access_token) {
                        clearInterval(pollInterval);
                        saveAuth(check.access_token);
                        Lampa.Modal.close();
                        Lampa.Bell.show({ text: 'Simkl успішно підключено!' });
                    }
                } catch (e) {
                    // Код ще не підтверджено користувачем
                }
            }, (data.expires_in ? 5 : 3) * 1000);

        } catch (e) {
            Lampa.Bell.show({ text: 'Помилка отримання PIN-коду Simkl' });
        }
    }

    function saveAuth(token) {
        state.account = { access_token: token, created_at: Date.now() };
        Lampa.Storage.set(CONFIG.STORAGE_KEY, state.account);
    }

    function clearAuth() {
        state.account = {};
        Lampa.Storage.remove(CONFIG.STORAGE_KEY);
    }

    // ==========================================
    // 5. МОДУЛЬ СКРОББЛІНГУ (WATCHING & PROGRESS)
    // ==========================================
    const Scrobbler = {
        async sendProgress(card, progressPercent, eventType = 'watching') {
            if (!state.account.access_token) return;

            const now = Date.now();
            const percentDiff = Math.abs(progressPercent - state.lastScrobblePercent);

            // Throttling: відправляємо тільки при зміні > 5% або пройшло достатньо часу
            if (eventType === 'watching' && percentDiff < 5 && (now - state.lastScrobbleTime) < CONFIG.PROGRESS_THROTTLE_MS) {
                return;
            }

            const payload = {
                shows: card.number_of_seasons ? [{
                    ids: { tmdb: card.id },
                    seasons: [{
                        number: card.season || 1,
                        episodes: [{ number: card.episode || 1 }]
                    }]
                }] : undefined,
                movies: !card.number_of_seasons ? [{
                    ids: { tmdb: card.id }
                }] : undefined,
                progress: Math.round(progressPercent)
            };

            const endpoint = eventType === 'stop' ? '/scrobble/stop' : '/scrobble/start';

            try {
                await apiRequest(endpoint, {
                    method: 'POST',
                    body: payload
                });
                state.lastScrobbleTime = now;
                state.lastScrobblePercent = progressPercent;
            } catch (err) {
                console.error('[Simkl Scrobbler]', err);
            }
        },

        async markAsWatched(card) {
            if (!state.account.access_token) return;

            const payload = card.number_of_seasons ? {
                shows: [{ ids: { tmdb: card.id } }]
            } : {
                movies: [{ ids: { tmdb: card.id } }]
            };

            try {
                await apiRequest('/sync/add-to-history', {
                    method: 'POST',
                    body: payload
                });
                Lampa.Bell.show({ text: 'Додано в переглянуті Simkl' });
            } catch (err) {
                Lampa.Bell.show({ text: 'Помилка синхронізації з Simkl' });
            }
        }
    };

    // ==========================================
    // 6. ІНТЕГРАЦІЯ З LAMPA (LISTENERS & MENU)
    // ==========================================
    function initEvents() {
        // Відстеження прогресу плеєра Lampa
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

        // Додавання налаштувань у меню Lampa
        Lampa.Settings.listener.follow('open', (e) => {
            if (e.name === 'main') {
                e.body.find('[data-action="account"]').after(
                    `<div class="settings-param selector" data-action="simkl_auth">
                        <div class="settings-param__name">Simkl</div>
                        <div class="settings-param__value">${state.account.access_token ? 'Підключено' : 'Підключити'}</div>
                    </div>`
                );

                e.body.find('[data-action="simkl_auth"]').on('hover:enter', () => {
                    if (state.account.access_token) {
                        clearAuth();
                        Lampa.Bell.show({ text: 'Акаунт Simkl відключено' });
                    } else {
                        startDeviceAuth();
                    }
                });
            }
        });
    }

    // Реєстрація плагіна в Lampa
    if (window.appready) {
        initEvents();
    } else {
        Lampa.Listener.follow('app', (e) => {
            if (e.type === 'ready') initEvents();
        });
    }
})();
