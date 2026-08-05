(function () {
    'use strict';

    // 1. ПОЛІФІЛИ (для сумісності зі старими TV)
    if (!Object.keys) {
        Object.keys = function getObjectKeys(o) {
            var r = [], k;
            for (k in o) { if (Object.prototype.hasOwnProperty.call(o, k)) { r.push(k); } }
            return r;
        };
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function mapArray(c, t) {
            if (this == null) throw new TypeError('Array is null or undefined');
            var s = Object(this), l = s.length >>> 0;
            if (typeof c !== 'function') throw new TypeError(c + ' is not a function');
            var r = new Array(l);
            for (var i = 0; i < l; i++) { if (i in s) { r[i] = c.call(t, s[i], i, s); } }
            return r;
        };
    }
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function forEachArray(c, t) {
            if (this == null) throw new TypeError('Array is null or undefined');
            var s = Object(this), l = s.length >>> 0;
            if (typeof c !== 'function') throw new TypeError(c + ' is not a function');
            var i = 0; while (i < l) { if (i in s) { c.call(t, s[i], i, s); } i++; }
        };
    }

    addTranslates();

    // 2. КОНСТАНТИ ТА НАЛАШТУВАННЯ
    var ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/></svg>';
    var SOURCE_NAME = 'DORAMA_CAT';
    var CACHE_SIZE = 100;
    var CACHE_TIME = 1000 * 60 * 60 * 3; // 3 години
    var cache = {};

    var CAT_NAME = 'Дорами та Медіа';

    // Фільтри виключення для TMDB Discover API
    var EXCLUDE_LANGS = 'ru,zh,cn,hi,kn,ml,ta,te,be';
    var EXCLUDE_COUNTRIES = 'RU,BY,CN,IN';

    // Означення категорій
    var CATEGORIES = {
        dorama_tv: {
            id: 'dorama_tv',
            type: 'tv',
            params: '&with_origin_country=KR&without_genres=16',
            title_key: 'title_dorama_tv'
        },
        dorama_movie: {
            id: 'dorama_movie',
            type: 'movie',
            params: '&with_origin_country=KR&without_genres=16',
            title_key: 'title_dorama_movie'
        },
        movies_trending: {
            id: 'movies_trending',
            type: 'movie',
            params: '&sort_by=popularity.desc',
            title_key: 'title_movies_popular'
        },
        movies_top: {
            id: 'movies_top',
            type: 'movie',
            params: '&sort_by=vote_average.desc&vote_count.gte=300',
            title_key: 'title_movies_top'
        },
        tv_trending: {
            id: 'tv_trending',
            type: 'tv',
            params: '&sort_by=popularity.desc',
            title_key: 'title_tv_popular'
        },
        tv_top: {
            id: 'tv_top',
            type: 'tv',
            params: '&sort_by=vote_average.desc&vote_count.gte=200',
            title_key: 'title_tv_top'
        },
        cartoons_movie: {
            id: 'cartoons_movie',
            type: 'movie',
            params: '&with_genres=16&without_keywords=210024|287501', // Виключає аніме за ключовими тегами + фільтр країн
            title_key: 'title_cartoons_movie'
        },
        cartoons_tv: {
            id: 'cartoons_tv',
            type: 'tv',
            params: '&with_genres=16&without_keywords=210024|287501',
            title_key: 'title_cartoons_tv'
        },
        genre_action: {
            id: 'genre_action',
            type: 'movie',
            params: '&with_genres=28',
            title_key: 'title_genre_action'
        },
        genre_comedy: {
            id: 'genre_comedy',
            type: 'movie',
            params: '&with_genres=35',
            title_key: 'title_genre_comedy'
        },
        genre_romance: {
            id: 'genre_romance',
            type: 'tv',
            params: '&with_genres=10749,10759',
            title_key: 'title_genre_romance'
        }
    };

    // 3. СЛУЖБА КЕШУВАННЯ ТА ОБРОБКИ API
    function CatalogApiService() {
        var self = this;
        self.network = new Lampa.Reguest();

        function getCache(key) {
            var res = cache[key];
            if (res) {
                var cache_timestamp = Date.now() - CACHE_TIME;
                if (res.timestamp > cache_timestamp) return res.value;
                for (var ID in cache) {
                    if (!(cache[ID] && cache[ID].timestamp > cache_timestamp)) delete cache[ID];
                }
            }
            return null;
        }

        function setCache(key, value) {
            var timestamp = Date.now();
            if (Object.keys(cache).length >= CACHE_SIZE) {
                var cache_timestamp = timestamp - CACHE_TIME;
                for (var ID in cache) {
                    if (!(cache[ID] && cache[ID].timestamp > cache_timestamp)) delete cache[ID];
                }
            }
            cache[key] = { timestamp: timestamp, value: value };
        }

        // Пост-фільтрація (Захисний шар від Аніме JP та небажаного контенту)
        function filterResults(list, isCartoon) {
            if (!Array.isArray(list)) return [];
            return list.filter(function (item) {
                var lang = (item.original_language || '').toLowerCase();
                var country = (item.origin_country || []).map(function(c) { return c.toUpperCase(); });

                // Блокуємо мови та країни
                if (['ru', 'zh', 'cn', 'hi', 'kn', 'ml', 'ta', 'te', 'be'].indexOf(lang) !== -1) return false;
                if (country.indexOf('RU') !== -1 || country.indexOf('BY') !== -1 || country.indexOf('CN') !== -1 || country.indexOf('IN') !== -1) return false;

                // Блокуємо Аніме (Мультфільми з Японії / мовою JA)
                if (isCartoon || item.genre_ids && item.genre_ids.indexOf(16) !== -1) {
                    if (lang === 'ja' || country.indexOf('JP') !== -1) return false;
                }

                return true;
            });
        }

        function normalizeData(json, isCartoon) {
            var rawResults = json.results || [];
            var cleanResults = filterResults(rawResults, isCartoon);

            return {
                results: cleanResults.map(function (item) {
                    return {
                        id: item.id,
                        title: item.title || item.name,
                        name: item.name || item.title,
                        original_title: item.original_title || item.original_name,
                        original_name: item.original_name || item.original_title,
                        poster_path: item.poster_path ? Lampa.TMDB.image('t/p/w500' + item.poster_path) : '',
                        backdrop_path: item.backdrop_path ? Lampa.TMDB.image('t/p/w1280' + item.backdrop_path) : '',
                        overview: item.overview || '',
                        vote_average: item.vote_average || 0,
                        release_date: item.release_date || item.first_air_date || '',
                        first_air_date: item.first_air_date || item.release_date || '',
                        source: SOURCE_NAME,
                        media_type: item.title ? 'movie' : 'tv'
                    };
                }),
                page: json.page || 1,
                total_pages: json.total_pages || 1,
                total_results: cleanResults.length
            };
        }

        self.get = function (url, isCartoon, onComplete, onError) {
            var cached = getCache(url);
            if (cached) {
                onComplete(cached);
                return;
            }

            self.network.silent(url, function (json) {
                if (!json) {
                    onError(new Error('Empty response'));
                    return;
                }
                var normalized = normalizeData(json, isCartoon);
                setCache(url, normalized);
                onComplete(normalized);
            }, onError);
        };

        self.list = function (params, onComplete, onError) {
            params = params || {};
            var catId = (params.url || 'dorama_tv');
            var catObj = CATEGORIES[catId] || CATEGORIES.dorama_tv;
            var page = params.page || 1;
            var lang = Lampa.Storage.get('tmdb_lang', 'uk');

            var baseUrl = 'https://api.themoviedb.org/3/discover/' + catObj.type;
            var url = baseUrl + '?api_key=' + Lampa.TMDB.key() +
                      '&language=' + lang +
                      '&page=' + page +
                      '&without_original_language=' + EXCLUDE_LANGS +
                      '&without_companies=' + EXCLUDE_COUNTRIES +
                      catObj.params;

            var isCartoon = catId.indexOf('cartoons') !== -1;

            self.get(url, isCartoon, onComplete, onError);
        };

        self.full = function (params, onSuccess, onError) {
            var card = params.card;
            params.method = (card.media_type === 'tv' || card.first_air_date) ? 'tv' : 'movie';
            Lampa.Api.sources.tmdb.full(params, onSuccess, onError);
        };

        self.category = function (params, onSuccess, onError) {
            var partsLimit = 5;
            var partsData = [];

            Object.keys(CATEGORIES).forEach(function (key) {
                var cat = CATEGORIES[key];
                var settingName = 'doramacat_setting_' + key;
                var isVisible = Lampa.Storage.get(settingName, 'true').toString() === 'true';

                if (isVisible) {
                    partsData.push(function (callback) {
                        var lang = Lampa.Storage.get('tmdb_lang', 'uk');
                        var url = 'https://api.themoviedb.org/3/discover/' + cat.type +
                                  '?api_key=' + Lampa.TMDB.key() +
                                  '&language=' + lang +
                                  '&page=1' +
                                  '&without_original_language=' + EXCLUDE_LANGS +
                                  cat.params;

                        var isCartoon = key.indexOf('cartoons') !== -1;

                        self.get(url, isCartoon, function (json) {
                            callback({
                                url: key,
                                title: Lampa.Lang.translate(cat.title_key),
                                page: 1,
                                total_results: json.total_results,
                                total_pages: json.total_pages,
                                more: json.total_pages > 1,
                                results: json.results,
                                source: SOURCE_NAME
                            });
                        }, function (err) {
                            callback({ error: err });
                        });
                    });
                }
            });

            Lampa.Api.partNext(partsData, partsLimit, onSuccess, onError);
        };

        self.clear = function () {
            self.network.clear();
        };

        self.person = function (p, s, e) { Lampa.Api.sources.tmdb.person(p, s, e); };
        self.seasons = function (p, s, e) { Lampa.Api.sources.tmdb.seasons(p, s, e); };
    }

    // 4. МОВНІ РЕСУРСИ
    function addTranslates() {
        Lampa.Lang.add({
            title_dorama_tv: { uk: 'Дорами (Серіали)', en: 'Dorama (TV Series)', ru: 'Дорамы (Сериалы)' },
            title_dorama_movie: { uk: 'Дорами (Фільми)', en: 'Dorama (Movies)', ru: 'Дорамы (Фильмы)' },
            title_movies_popular: { uk: 'Популярні Фільми', en: 'Popular Movies', ru: 'Популярные Фильмы' },
            title_movies_top: { uk: 'Найкращі Фільми', en: 'Top Rated Movies', ru: 'Лучшие Фильмы' },
            title_tv_popular: { uk: 'Популярні Серіали', en: 'Popular TV Shows', ru: 'Популярные Сериалы' },
            title_tv_top: { uk: 'Найкращі Серіали', en: 'Top Rated TV Shows', ru: 'Лучшие Сериалы' },
            title_cartoons_movie: { uk: 'Мультфільми (Західні)', en: 'Animated Movies', ru: 'Мультфильмы' },
            title_cartoons_tv: { uk: 'Мультсеріали (Західні)', en: 'Animated Series', ru: 'Мультсериалы' },
            title_genre_action: { uk: 'Екшн та Бойовики', en: 'Action', ru: 'Боевики' },
            title_genre_comedy: { uk: 'Комедії', en: 'Comedies', ru: 'Комедии' },
            title_genre_romance: { uk: 'Мелодрами та Романтика', en: 'Romance', ru: 'Мелодрамы' },
            doramacat_title: { uk: 'Каталог Дорам та Медіа', en: 'Dorama & Media Catalog', ru: 'Каталог Дорам и Медиа' },
            doramacat_select_visibility: { uk: 'Відображати секцію в списку', en: 'Show section in list', ru: 'Отображать секцию в списке' }
        });
    }

    // 5. ТОЧКА ВХОДУ ТА НАЛАШТУВАННЯ
    function startPlugin() {
        if (window.doramacat_plugin) return;
        window.doramacat_plugin = true;

        CAT_NAME = Lampa.Storage.get('doramacat_cat_name', 'Дорами та Медіа');

        // Реєстрація джерела
        var apiService = new CatalogApiService();
        Lampa.Api.sources[SOURCE_NAME] = apiService;

        // Додавання розділу в меню Налаштувань
        Lampa.SettingsApi.addComponent({
            component: 'doramacat_settings',
            name: CAT_NAME,
            icon: ICON
        });

        // Налаштування назви джерела
        Lampa.SettingsApi.addParam({
            component: 'doramacat_settings',
            param: {
                name: 'doramacat_cat_name',
                type: 'input',
                default: CAT_NAME
            },
            field: {
                name: Lampa.Lang.translate('title'),
                description: 'Змінити назву пункту в бічному меню'
            },
            onChange: function (value) {
                CAT_NAME = value;
                $('.doramacat_cat_text').text(value);
                Lampa.Settings.update();
            }
        });

        // Налаштування видимості кожної категорії
        Object.keys(CATEGORIES).forEach(function (key) {
            var settingName = 'doramacat_setting_' + key;
            var visible = Lampa.Storage.get(settingName, 'true').toString() === 'true';

            Lampa.SettingsApi.addParam({
                component: 'doramacat_settings',
                param: {
                    name: settingName,
                    type: 'trigger',
                    default: visible
                },
                field: {
                    name: Lampa.Lang.translate(CATEGORIES[key].title_key),
                    description: Lampa.Lang.translate('doramacat_select_visibility')
                },
                onChange: function (val) {
                    Lampa.Storage.set(settingName, val);
                }
            });
        });

        // Додавання пункту в бічне ліве меню Lampa
        var menuItem = $(
            '<li data-action="doramacat" class="menu__item selector">' +
                '<div class="menu__ico">' + ICON + '</div>' +
                '<div class="menu__text doramacat_cat_text">' + CAT_NAME + '</div>' +
            '</li>'
        );

        menuItem.on('hover:enter', function () {
            Lampa.Activity.push({
                title: CAT_NAME,
                component: 'category',
                source: SOURCE_NAME,
                page: 1
            });
        });

        $('.menu .menu__list').eq(0).append(menuItem);
    }

    // Запуск після готовності додатка
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') startPlugin();
        });
    }
})();
