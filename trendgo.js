(function () {
    // Polyfills
    if (!Object.keys) { Object.keys = function getObjectKeys(o) { var r = [], k; for (k in o) { if (Object.prototype.hasOwnProperty.call(o, k)) { r.push(k); } } return r; }; }
    if (!Array.prototype.map) { Array.prototype.map = function mapArray(c, t) { if (this == null) { throw new TypeError('Array is null or undefined'); } var s = Object(this), l = s.length >>> 0; if (typeof c !== 'function') { throw new TypeError(c + ' is not a function'); } var r = new Array(l); for (var i = 0; i < l; i++) { if (i in s) { r[i] = c.call(t, s[i], i, s); } } return r; }; }
    if (!Array.prototype.forEach) { Array.prototype.forEach = function forEachArray(c, t) { if (this == null) { throw new TypeError('Array is null or undefined'); } var s = Object(this), l = s.length >>> 0; if (typeof c !== 'function') { throw new TypeError(c + ' is not a function'); } for (var i = 0; i < l; i++) { if (i in s) { c.call(t, s[i], i, s); } } }; }
    if (!Array.prototype.indexOf) { Array.prototype.indexOf = function indexOfElement(e, f) { if (this == null) { throw new TypeError('"this" is null or not defined'); } var s = Object(this), l = s.length >>> 0; if (l === 0) return -1; var i = Number(f) || 0; if (i >= l) return -1; var k = Math.max(i >= 0 ? i : l - Math.abs(i), 0); while (k < l) { if (k in s && s[k] === e) return k; k++; } return -1; }; }

    addTranslates();

    var ICON = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><path fill="currentColor" d="M482.909,67.2H29.091C13.05,67.2,0,80.25,0,96.291v319.418C0,431.75,13.05,444.8,29.091,444.8h453.818c16.041,0,29.091-13.05,29.091-29.091V96.291C512,80.25,498.95,67.2,482.909,67.2z M477.091,409.891H34.909V102.109h442.182V409.891z"/></g><g><rect fill="currentColor" x="126.836" y="84.655" width="34.909" height="342.109"/></g><g><rect fill="currentColor" x="350.255" y="84.655" width="34.909" height="342.109"/></g></svg>';

    var SOURCE_NAME = 'SIMKL';
    var CACHE_SIZE = 100;
    var CACHE_TIME = 1000 * 60 * 60 * 3; // 3h
    var cache = {};

    var SIMKL_CLIENT_ID = '28411c2510ddc138f76bc3e1022981f88e4402ad1b9e9e11e5d379667360bfdf';
    var SIMKL_BASE_URL = 'https://api.simkl.org';
    var APP_NAME = 'LampaSimklPlugin';
    var APP_VERSION = '1.0.0';

    var EXCLUDED_COUNTRIES = ['ru', 'by', 'cn', 'in'];

    var CAT_NAME = SOURCE_NAME;

    var DISPLAY_OPTIONS = {
        movies_trending: { title: '🍿 Фільми: Тренди', url: 'movies/trending' },
        movies_popular: { title: '🍿 Фільми: Популярні', url: 'movies/popular' },
        movies_best: { title: '🍿 Фільми: Топ рейтингу', url: 'movies/best' },
        movies_action: { title: '🍿 Фільми: Бойовики', url: 'movies/genres/action' },
        movies_comedy: { title: '🍿 Фільми: Комедії', url: 'movies/genres/comedy' },
        movies_horror: { title: '🍿 Фільми: Жахи', url: 'movies/genres/horror' },
        
        tv_trending: { title: '📺 Серіали: Тренди', url: 'tv/trending' },
        tv_popular: { title: '📺 Серіали: Популярні', url: 'tv/popular' },
        tv_best: { title: '📺 Серіали: Топ рейтингу', url: 'tv/best' },
        tv_drama: { title: '📺 Серіали: Драми', url: 'tv/genres/drama' },
        tv_scifi: { title: '📺 Серіали: Фантастика', url: 'tv/genres/sci-fi' },

        dorama_movies: { title: '🏮 Дорами (Фільми)', url: 'movies/asian/popular' },
        dorama_tv_trending: { title: '🎎 Дорами (Серіали): Тренди', url: 'tv/asian/trending' },
        dorama_tv_popular: { title: '🎎 Дорами (Серіали): Популярні', url: 'tv/asian/popular' },

        cartoons: { title: '🎨 Мультфільми', url: 'movies/genres/animation' },
        cartoons_tv: { title: '🧸 Мультсеріали', url: 'tv/genres/animation' }
    };

    function SimklApiService() {
        var self = this;
        self.network = new Lampa.Reguest();

        function getCache(key) {
            var res = cache[key];
            if (res) {
                var cache_timestamp = Date.now() - CACHE_TIME;
                if (res.timestamp > cache_timestamp) return res.value;

                for (var ID in cache) {
                    var node = cache[ID];
                    if (!(node && node.timestamp > cache_timestamp)) delete cache[ID];
                }
            }
            return null;
        }

        function setCache(key, value) {
            var timestamp = Date.now();
            var size = Object.keys(cache).length;

            if (size >= CACHE_SIZE) {
                var cache_timestamp = timestamp - CACHE_TIME;
                for (var ID in cache) {
                    var node = cache[ID];
                    if (!(node && node.timestamp > cache_timestamp)) delete cache[ID];
                }
                size = Object.keys(cache).length;
                if (size >= CACHE_SIZE) {
                    var timestamps = [];
                    for (var ID in cache) {
                        var node = cache[ID];
                        timestamps.push(node && node.timestamp || 0);
                    }
                    timestamps.sort(function (a, b) { return a - b; });
                    cache_timestamp = timestamps[Math.floor(timestamps.length / 2)];
                    for (var ID in cache) {
                        var node = cache[ID];
                        if (!(node && node.timestamp > cache_timestamp)) delete cache[ID];
                    }
                }
            }

            cache[key] = {
                timestamp: timestamp,
                value: value
            };
        }

        function normalizeData(json, type) {
            var rawList = Array.isArray(json) ? json : (json.results || []);
            var results = [];

            rawList.forEach(function (item) {
                var ids = item.ids || {};
                var tmdbId = ids.tmdb;

                // Обов'язкова наявність TMDB ID для глибокої інтеграції з Lampa
                if (!tmdbId) return;

                // Фільтрація за забороненими країнами (RU, BY, CN, IN)
                if (item.country) {
                    var country = (item.country + '').toLowerCase();
                    if (EXCLUDED_COUNTRIES.indexOf(country) !== -1) return;
                }

                // Виключення Аніме
                if (item.anime_type || item.root_type === 'anime') return;
                if (item.genres && Array.isArray(item.genres)) {
                    var isAnime = item.genres.some(function (g) {
                        return (g + '').toLowerCase() === 'anime';
                    });
                    if (isAnime) return;
                }

                var isTv = type === 'tv' || !!item.total_episodes || item.root_type === 'tv';

                var dataItem = {
                    id: tmdbId,
                    poster_path: item.poster ? 'https://simkl.in/posters/' + item.poster + '_m.jpg' : '',
                    backdrop_path: item.fanart ? 'https://simkl.in/fanart/' + item.fanart + '_medium.jpg' : '',
                    overview: item.overview || '',
                    vote_average: item.ratings && item.ratings.simkl ? (item.ratings.simkl.rating || 0) : 0,
                    name: item.title || '',
                    title: item.title || '',
                    original_name: item.en_title || item.title || '',
                    original_title: item.en_title || item.title || '',
                    release_date: item.year ? item.year + '-01-01' : '',
                    first_air_date: item.year ? item.year + '-01-01' : '',
                    media_type: isTv ? 'tv' : 'movie',
                    source: 'tmdb' // Перенаправляємо на TMDB для відкриття деталей
                };

                dataItem.promo_title = dataItem.name || dataItem.title;
                dataItem.promo = dataItem.overview;

                results.push(dataItem);
            });

            return {
                results: results,
                page: json.page || 1,
                total_pages: json.total_pages || 1,
                total_results: results.length
            };
        }

        function getFromCache(url, params, type, onComplete, onError) {
            var json = getCache(url);
            if (json) {
                onComplete(normalizeData(json, type));
            } else {
                self.get(url, params, type, onComplete, onError);
            }
        }

        self.get = function (url, params, type, onComplete, onError) {
            var sep = url.indexOf('?') !== -1 ? '&' : '?';
            var fullUrl = url + sep + 'client_id=' + SIMKL_CLIENT_ID + '&app-name=' + encodeURIComponent(APP_NAME) + '&app-version=' + APP_VERSION;

            self.network.native(fullUrl, function (json) {
                if (!json) {
                    onError(new Error('Empty response from server'));
                    return;
                }
                var parsedJson = typeof json === 'string' ? JSON.parse(json) : json;
                var normalizedJson = normalizeData(parsedJson, type);
                setCache(url, parsedJson);
                onComplete(normalizedJson);
            }, function (error) {
                onError(error);
            }, false, {
                headers: {
                    'User-Agent': APP_NAME + '/' + APP_VERSION
                }
            });
        };

        self.list = function (params, onComplete, onError) {
            params = params || {};
            onComplete = onComplete || function () {};
            onError = onError || function () {};

            var endpoint = params.url || 'movies/trending';
            var type = endpoint.indexOf('tv') === 0 ? 'tv' : 'movie';
            var url = SIMKL_BASE_URL + '/' + endpoint;

            getFromCache(url, params, type, function (json) {
                onComplete(json);
            }, onError);
        };

        self.full = function (params, onSuccess, onError) {
            var card = params.card;
            params.method = !!(card.number_of_seasons || card.seasons || card.last_episode_to_air || card.first_air_date || card.media_type === 'tv') ? 'tv' : 'movie';

            Lampa.Api.sources.tmdb.full(params, onSuccess, onError);
        };

        self.category = function (params, onSuccess, onError) {
            params = params || {};
            var partsLimit = 5;
            var partsData = [];

            Object.keys(DISPLAY_OPTIONS).forEach(function (key) {
                var option = DISPLAY_OPTIONS[key];
                if (option.visible) {
                    partsData.push(function (callback) {
                        makeRequest(option.url, option.title, callback);
                    });
                }
            });

            function loadPart(partLoaded, partEmpty) {
                Lampa.Api.partNext(partsData, partsLimit, function (result) {
                    partLoaded(result);
                }, function (error) {
                    partEmpty(error);
                });
            }

            loadPart(onSuccess, onError);
            return loadPart;

            function makeRequest(endpoint, title, callback) {
                var url = SIMKL_BASE_URL + '/' + endpoint;
                var type = endpoint.indexOf('tv') === 0 ? 'tv' : 'movie';

                getFromCache(url, params, type, function (json) {
                    var result = {
                        url: endpoint,
                        title: title,
                        page: 1,
                        total_results: json.total_results || 0,
                        total_pages: 1,
                        more: false,
                        results: json.results || [],
                        source: SOURCE_NAME
                    };
                    callback(result);
                }, function (error) {
                    callback({ error: error });
                });
            }
        };

        self.clear = function () {
            self.network.clear();
        };

        self.person = function (params, onSuccess, onError) {
            Lampa.Api.sources.tmdb.person(params, onSuccess, onError);
        };

        self.seasons = function (params, onSuccess, onError) {
            Lampa.Api.sources.tmdb.seasons(params, onSuccess, onError);
        };
    }

    function addTranslates() {
        Lampa.Lang.add({
            simkl_title: {
                en: 'Title',
                uk: 'Назва',
                ru: 'Название'
            },
            simkl_title_desc: {
                en: 'Enter a title instead of ',
                uk: 'Введіть назву замість ',
                ru: 'Введите своё название вместо '
            },
            simkl_select_visibility: {
                en: 'Select whether the category will be visible',
                uk: 'Виберіть чи буде відображатися категорія',
                ru: 'Выберете будет ли отображаться категория'
            }
        });
    }

    function startPlugin() {
        if (window.simkl_plugin) {
            return;
        }
        window.simkl_plugin = true;

        CAT_NAME = Lampa.Storage.get('simkl_settings_cat_name', SOURCE_NAME);

        if (Lampa.Storage.field('start_page') === SOURCE_NAME) {
            window.start_deep_link = {
                component: 'category',
                page: 1,
                url: '',
                source: SOURCE_NAME,
                title: CAT_NAME
            };
        }

        var values = Lampa.Params.values.start_page;
        values[SOURCE_NAME] = CAT_NAME;

        Lampa.SettingsApi.addComponent({
            component: 'simkl_settings',
            name: CAT_NAME,
            icon: ICON
        });

        Lampa.SettingsApi.addParam({
            component: 'simkl_settings',
            param: {
                name: 'simkl_settings_cat_name',
                type: 'input',
                placeholder: '',
                values: '',
                default: CAT_NAME
            },
            field: {
                name: Lampa.Lang.translate('simkl_title'),
                description: Lampa.Lang.translate('simkl_title_desc') + SOURCE_NAME
            },
            onChange: function (value) {
                CAT_NAME = value;
                $('.simkl_cat_text').text(value);
                Lampa.Settings.update();
            }
        });

        Object.keys(DISPLAY_OPTIONS).forEach(function (option) {
            var settingName = 'simkl_settings_' + option + '_visible';

            var visible = Lampa.Storage.get(settingName, 'true').toString() === 'true';
            DISPLAY_OPTIONS[option].visible = visible;

            Lampa.SettingsApi.addParam({
                component: 'simkl_settings',
                param: {
                    name: settingName,
                    type: 'trigger',
                    default: visible
                },
                field: {
                    name: DISPLAY_OPTIONS[option].title,
                    description: Lampa.Lang.translate('simkl_select_visibility')
                },
                onChange: function (value) {
                    DISPLAY_OPTIONS[option].visible = value === 'true';
                }
            });
        });

        var simklApi = new SimklApiService();
        Lampa.Api.sources[SOURCE_NAME] = simklApi;

        var menuItem = $('<li data-action="simkl" class="menu__item selector"><div class="menu__ico">' + ICON + '</div><div class="menu__text simkl_cat_text">' + CAT_NAME + '</div></li>');
        $('.menu .menu__list').eq(0).append(menuItem);

        menuItem.on('hover:enter', function () {
            Lampa.Activity.push({
                title: CAT_NAME,
                component: 'category',
                source: SOURCE_NAME,
                page: 1
            });
        });
    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                startPlugin();
            }
        });
    }
})();
