(function () {
    'use strict';

    if (window.simkl_lampa_plugin) return;
    window.simkl_lampa_plugin = true;

    // --- НАЛАШТУВАННЯ API SIMKL ---
    var SIMKL_CLIENT_ID = '28411c2510ddc138f76bc3e1022981f88e4402ad1b9e9e11e5d379667360bfdf';
    var APP_NAME = 'LampaSimklPlugin';
    var APP_VERSION = '1.0.0';
    var BASE_SIMKL_URL = 'https://api.simkl.org';

    var SOURCE_NAME = 'simkl_catalog';
    var CAT_TITLE = 'SimKL Каталог';

    // Заборонені країни походження (RU, BY, CN, IN)
    var EXCLUDED_COUNTRIES = ['ru', 'by', 'cn', 'in'];

    // Кеш для запитів (1 година)
    var CACHE_TIME = 1000 * 60 * 60;
    var cache = {};

    function addQueryParams(url) {
        var sep = url.indexOf('?') !== -1 ? '&' : '?';
        return url + sep + 'client_id=' + SIMKL_CLIENT_ID + '&app-name=' + encodeURIComponent(APP_NAME) + '&app-version=' + APP_VERSION;
    }

    function SimklApiService() {
        var self = this;
        self.network = new Lampa.Reguest();

        function getCache(key) {
            var res = cache[key];
            if (res && (Date.now() - res.timestamp < CACHE_TIME)) {
                return res.value;
            }
            return null;
        }

        function setCache(key, value) {
            cache[key] = {
                timestamp: Date.now(),
                value: value
            };
        }

        // Перетворення відповіді SimKL у формат результатів TMDB для Lampa
        function normalizeSimklData(items, type) {
            var results = [];
            if (!Array.isArray(items)) return { results: [], page: 1, total_pages: 1 };

            items.forEach(function (item) {
                var ids = item.ids || {};
                var tmdbId = ids.tmdb;

                // Пропускаємо елементи без TMDB ID
                if (!tmdbId) return;

                // Фільтрація за країною походження (якщо присутня у відповіді)
                if (item.country) {
                    var country = item.country.toLowerCase();
                    if (EXCLUDED_COUNTRIES.indexOf(country) !== -1) return;
                }

                // Виключення Аніме за жанрами або тегами SimKL
                if (item.genres && Array.isArray(item.genres)) {
                    var isAnime = item.genres.some(function (g) {
                        return g.toLowerCase() === 'anime';
                    });
                    if (isAnime) return;
                }

                var isTv = type === 'tv' || type === 'shows' || !!item.total_episodes;

                results.push({
                    id: tmdbId, // Головне: передаємо TMDB ID, щоб Lampa відкривала рідну картку TMDB
                    title: item.title,
                    name: item.title,
                    original_title: item.en_title || item.title,
                    original_name: item.en_title || item.title,
                    overview: item.overview || '',
                    poster_path: item.poster ? 'https://simkl.in/posters/' + item.poster + '_m.jpg' : '',
                    backdrop_path: item.fanart ? 'https://simkl.in/fanart/' + item.fanart + '_medium.jpg' : '',
                    vote_average: item.ratings && item.ratings.simkl ? (item.ratings.simkl.rating || 0) : 0,
                    release_date: item.year ? item.year + '-01-01' : '',
                    first_air_date: item.year ? item.year + '-01-01' : '',
                    media_type: isTv ? 'tv' : 'movie',
                    source: 'tmdb' // Звернення до стандартної деталізації TMDB
                });
            });

            return {
                results: results,
                page: 1,
                total_pages: 1,
                total_results: results.length
            };
        }

        self.get = function (endpoint, type, onComplete, onError) {
            var url = addQueryParams(BASE_SIMKL_URL + endpoint);
            var cached = getCache(url);

            if (cached) {
                return onComplete(cached);
            }

            self.network.native(url, function (json) {
                try {
                    var parsed = typeof json === 'string' ? JSON.parse(json) : json;
                    var normalized = normalizeSimklData(parsed, type);
                    setCache(url, normalized);
                    onComplete(normalized);
                } catch (e) {
                    onError(e);
                }
            }, onError, false, {
                headers: {
                    'User-Agent': APP_NAME + '/' + APP_VERSION
                }
            });
        };

        self.list = function (params, onComplete, onError) {
            var urlParam = params.url || 'movies/trending';
            var parts = urlParam.split('/');
            var type = parts[0];

            self.get('/' + urlParam, type, onComplete, onError);
        };

        self.full = function (params, onSuccess, onError) {
            // Для детальної сторінки картки використовується стандартний TMDB
            Lampa.Api.sources.tmdb.full(params, onSuccess, onError);
        };

        self.category = function (params, onSuccess, onError) {
            var partsData = [];

            // Конфігуратор категорій відповідно до вимог
            var categories = [
                // --- ФІЛЬМИ ---
                { title: '🍿 Фільми: Тренди', url: 'movies/trending' },
                { title: '🍿 Фільми: Популярні', url: 'movies/popular' },
                { title: '🍿 Фільми: Топ рейтингу', url: 'movies/best' },
                { title: '🍿 Фільми: Бойовики', url: 'movies/genres/action' },
                { title: '🍿 Фільми: Комедії', url: 'movies/genres/comedy' },

                // --- СЕРІАЛИ ---
                { title: '📺 Серіали: Тренди', url: 'tv/trending' },
                { title: '📺 Серіали: Популярні', url: 'tv/popular' },
                { title: '📺 Серіали: Топ рейтингу', url: 'tv/best' },
                { title: '📺 Серіали: Драма', url: 'tv/genres/drama' },
                { title: '📺 Серіали: Фантастика', url: 'tv/genres/sci-fi' },

                // --- ДОРАМИ ---
                { title: '🏮 Дорами (Фільми): Популярні', url: 'movies/asian/popular' },
                { title: '🎎 Дорами (Серіали): Тренди', url: 'tv/asian/trending' },
                { title: '🎎 Дорами (Серіали): Популярні', url: 'tv/asian/popular' },

                // --- МУЛЬТФІЛЬМИ ТА МУЛЬТСЕРІАЛИ ---
                { title: '🎨 Мультфільми: Популярні', url: 'movies/genres/animation' },
                { title: '🧸 Мультсеріали: Тренди', url: 'tv/genres/animation' }
            ];

            categories.forEach(function (cat) {
                partsData.push(function (callback) {
                    var parts = cat.url.split('/');
                    var mediaType = parts[0];

                    self.get('/' + cat.url, mediaType, function (data) {
                        callback({
                            title: cat.title,
                            results: data.results,
                            url: cat.url,
                            source: SOURCE_NAME,
                            more: false
                        });
                    }, function (err) {
                        callback({ error: err });
                    });
                });
            });

            Lampa.Api.partNext(partsData, 5, onSuccess, onError);
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

    function initPlugin() {
        var simklApi = new SimklApiService();

        // Реєстрація нового джерела в Lampa
        Lampa.Api.sources[SOURCE_NAME] = simklApi;

        // Додавання пункту в бічне меню Lampa
        var ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

        var menuItem = $('<li data-action="simkl_catalog" class="menu__item selector"><div class="menu__ico">' + ICON + '</div><div class="menu__text">' + CAT_TITLE + '</div></li>');

        menuItem.on('hover:enter', function () {
            Lampa.Activity.push({
                title: CAT_TITLE,
                component: 'category',
                source: SOURCE_NAME,
                page: 1
            });
        });

        $('.menu .menu__list').eq(0).append(menuItem);
    }

    if (window.appready) {
        initPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') initPlugin();
        });
    }
})();
