(function () {
    'use strict';

    if (window.plugin_ultimate_collections_ready) return;
    window.plugin_ultimate_collections_ready = true;

    // --- НАЛАШТУВАННЯ ТА КОНФІГУРАЦІЇ ---

    var WEST_LANGS = "en|fr|de|es|it|ca|nl|sv|da|no|pl|uk";
    var BLOCKED_LANGS = ['ja', 'ko', 'zh', 'cn', 'ru', 'be'];
    var BLOCKED_COUNTRIES = ['JP', 'KR', 'CN', 'TW', 'HK', 'RU', 'BY'];

    var CONFIGS = {
        western_anim: {
            id: 'western_anim_catalog',
            title: 'Мультиплікація',
            icon: '<svg viewBox="0 0 24 24" fill="#FF9800" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>',
            categories: [
                { title: "🔥 Свіжачок — Мультфільми (За рік)", url: "discover/movie", is_tv: false, params: { "with_genres": "16", "with_original_language": WEST_LANGS, "primary_release_date.gte": "{one_year_ago}", "primary_release_date.lte": "{current_date}", "vote_count.gte": "1", "sort_by": "popularity.desc" } },
                { title: "🔥 Свіжачок — Мультсеріали (За рік)", url: "discover/tv", is_tv: true, params: { "with_genres": "16", "without_genres": "10763,10764,10767", "with_original_language": WEST_LANGS, "first_air_date.gte": "{one_year_ago}", "first_air_date.lte": "{current_date}", "vote_count.gte": "1", "sort_by": "popularity.desc" } },
                { title: "⚡ 2020-ті роки — Мультфільми", url: "discover/movie", is_tv: false, params: { "with_genres": "16", "with_original_language": WEST_LANGS, "primary_release_date.gte": "2020-01-01", "vote_count.gte": "5", "sort_by": "popularity.desc" } },
                { title: "⚡ 2020-ті роки — Мультсеріали", url: "discover/tv", is_tv: true, params: { "with_genres": "16", "without_genres": "10763,10764,10767", "with_original_language": WEST_LANGS, "first_air_date.gte": "2020-01-01", "vote_count.gte": "5", "sort_by": "popularity.desc" } },
                { title: "💎 2010-ті роки — Мультфільми", url: "discover/movie", is_tv: false, params: { "with_genres": "16", "with_original_language": WEST_LANGS, "primary_release_date.gte": "2010-01-01", "primary_release_date.lte": "2019-12-31", "vote_count.gte": "10", "sort_by": "vote_count.desc" } },
                { title: "💎 2010-ті роки — Мультсеріали", url: "discover/tv", is_tv: true, params: { "with_genres": "16", "without_genres": "10763,10764,10767", "with_original_language": WEST_LANGS, "first_air_date.gte": "2010-01-01", "first_air_date.lte": "2019-12-31", "vote_count.gte": "10", "sort_by": "vote_count.desc" } },
                { title: "💿 2000-ні роки — Мультфільми", url: "discover/movie", is_tv: false, params: { "with_genres": "16", "with_original_language": WEST_LANGS, "primary_release_date.gte": "2000-01-01", "primary_release_date.lte": "2009-12-31", "vote_count.gte": "10", "sort_by": "vote_count.desc" } },
                { title: "💿 2000-ні роки — Мультсеріали", url: "discover/tv", is_tv: true, params: { "with_genres": "16", "without_genres": "10763,10764,10767", "with_original_language": WEST_LANGS, "first_air_date.gte": "2000-01-01", "first_air_date.lte": "2009-12-31", "vote_count.gte": "10", "sort_by": "vote_count.desc" } },
                { title: "📼 1990-ті роки — Мультфільми", url: "discover/movie", is_tv: false, params: { "with_genres": "16", "with_original_language": WEST_LANGS, "primary_release_date.gte": "1990-01-01", "primary_release_date.lte": "1999-12-31", "vote_count.gte": "5", "sort_by": "vote_count.desc" } },
                { title: "📼 1990-ті роки — Мультсеріали", url: "discover/tv", is_tv: true, params: { "with_genres": "16", "without_genres": "10763,10764,10767", "with_original_language": WEST_LANGS, "first_air_date.gte": "1990-01-01", "first_air_date.lte": "1999-12-31", "vote_count.gte": "5", "sort_by": "vote_count.desc" } }
            ]
        },
        movies: {
            id: 'movies_catalog',
            title: 'Фільми',
            icon: '<svg viewBox="0 0 24 24" fill="#E91E63" xmlns="http://www.w3.org/2000/svg"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H9l2 4H8L6 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>',
            categories: [
                { title: "🔥 Свіжачок (За рік)", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "primary_release_date.gte": "{one_year_ago}", "primary_release_date.lte": "{current_date}", "vote_count.gte": "10", "sort_by": "popularity.desc" } },
                { title: "Британські колонії", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "with_original_language": "en", "vote_count.gte": "300", "sort_by": "vote_count.desc" } },
                { title: "Європейська експансія", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "with_original_language": "fr|de|it|es|sv|da|no|pl|nl|pt|cs|hu|ro|fi|el|uk", "vote_count.gte": "50", "sort_by": "vote_count.desc" } },
                { title: "Азійська єдність", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "with_original_language": "ko|ja|zh|cn", "vote_count.gte": "50", "sort_by": "vote_count.desc" } },
                { title: "⚔️ Бойовики", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "with_genres": "28", "vote_count.gte": "100", "sort_by": "vote_count.desc" } },
                { title: "🤠 Пригоди", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "with_genres": "12", "vote_count.gte": "100", "sort_by": "vote_count.desc" } },
                { title: "😂 Комедії", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "with_genres": "35", "vote_count.gte": "100", "sort_by": "vote_count.desc" } },
                { title: "🚨 Кримінал", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "with_genres": "80", "vote_count.gte": "100", "sort_by": "vote_count.desc" } },
                { title: "🔎 Детективи", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "with_genres": "9648", "vote_count.gte": "100", "sort_by": "vote_count.desc" } },
                { title: "🎭 Драми", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "with_genres": "18", "vote_count.gte": "100", "sort_by": "vote_count.desc" } },
                { title: "😱 Жахи", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "with_genres": "27", "vote_count.gte": "100", "sort_by": "vote_count.desc" } },
                { title: "🏛️ Історичні", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "with_genres": "36", "vote_count.gte": "50", "sort_by": "vote_count.desc" } },
                { title: "🎼 Музичні", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "with_genres": "10402", "vote_count.gte": "50", "sort_by": "vote_count.desc" } },
                { title: "💖 Романтика / Мелодрами", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "with_genres": "10749", "vote_count.gte": "100", "sort_by": "vote_count.desc" } },
                { title: "👨‍👩‍👧 Сімейні", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "with_genres": "10751", "vote_count.gte": "50", "sort_by": "vote_count.desc" } },
                { title: "🔪 Трилери", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "with_genres": "53", "vote_count.gte": "100", "sort_by": "vote_count.desc" } },
                { title: "🚀 Фантастика", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "with_genres": "878", "vote_count.gte": "100", "sort_by": "vote_count.desc" } },
                { title: "🧙‍♂️ Фентезі", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "with_genres": "14", "vote_count.gte": "100", "sort_by": "vote_count.desc" } },
                { title: "🎖️ Військові", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "with_genres": "10752", "vote_count.gte": "50", "sort_by": "vote_count.desc" } },
                { title: "⚡ 2020-ті роки", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "primary_release_date.gte": "2020-01-01", "vote_count.gte": "50", "sort_by": "popularity.desc" } },
                { title: "💎 2010-ті роки", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "primary_release_date.gte": "2010-01-01", "primary_release_date.lte": "2019-12-31", "vote_count.gte": "100", "sort_by": "vote_count.desc" } },
                { title: "💿 2000-ні роки", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "primary_release_date.gte": "2000-01-01", "primary_release_date.lte": "2009-12-31", "vote_count.gte": "100", "sort_by": "vote_count.desc" } },
                { title: "📼 1990-ті роки", url: "discover/movie", is_tv: false, params: { "without_genres": "16", "without_original_language": "ru,be", "primary_release_date.gte": "1990-01-01", "primary_release_date.lte": "1999-12-31", "vote_count.gte": "100", "sort_by": "vote_count.desc" } }
            ]
        },
        tv: {
            id: 'tv_catalog',
            title: 'Серіали',
            icon: '<svg viewBox="0 0 24 24" fill="#2196F3" xmlns="http://www.w3.org/2000/svg"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>',
            categories: [
                { title: "🔥 Свіжачок (За рік)", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "without_original_language": "ru,be", "first_air_date.gte": "{one_year_ago}", "first_air_date.lte": "{current_date}", "vote_count.gte": "10", "sort_by": "popularity.desc" } },
                { title: "Британські колонії", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "with_original_language": "en", "vote_count.gte": "150", "sort_by": "vote_count.desc" } },
                { title: "Європейська експансія", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "with_original_language": "fr|de|it|es|sv|da|no|pl|nl|pt|cs|hu|ro|fi|el|uk", "vote_count.gte": "30", "sort_by": "vote_count.desc" } },
                { title: "Дорами", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "with_original_language": "ko|ja|zh|cn", "vote_count.gte": "30", "sort_by": "vote_count.desc" } },
                { title: "⚔️ Бойовики та Пригоди", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "without_original_language": "ru,be", "with_genres": "10759", "vote_count.gte": "50", "sort_by": "vote_count.desc" } },
                { title: "😂 Комедії", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "without_original_language": "ru,be", "with_genres": "35", "vote_count.gte": "50", "sort_by": "vote_count.desc" } },
                { title: "🚨 Кримінал", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "without_original_language": "ru,be", "with_genres": "80", "vote_count.gte": "50", "sort_by": "vote_count.desc" } },
                { title: "🔎 Детективи & Таємниці", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "without_original_language": "ru,be", "with_genres": "9648", "vote_count.gte": "50", "sort_by": "vote_count.desc" } },
                { title: "🎭 Драми", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "without_original_language": "ru,be", "with_genres": "18", "vote_count.gte": "50", "sort_by": "vote_count.desc" } },
                { title: "👨‍👩‍👧 Сімейні", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "without_original_language": "ru,be", "with_genres": "10751", "vote_count.gte": "30", "sort_by": "vote_count.desc" } },
                { title: "🚀 Фантастика та Фентезі", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "without_original_language": "ru,be", "with_genres": "10765", "vote_count.gte": "50", "sort_by": "vote_count.desc" } },
                { title: "🎖️ Військові та Політика", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "without_original_language": "ru,be", "with_genres": "10768", "vote_count.gte": "30", "sort_by": "vote_count.desc" } },
                { title: "⚡ 2020-ті роки", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "without_original_language": "ru,be", "first_air_date.gte": "2020-01-01", "vote_count.gte": "30", "sort_by": "popularity.desc" } },
                { title: "💎 2010-ті роки", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "without_original_language": "ru,be", "first_air_date.gte": "2010-01-01", "first_air_date.lte": "2019-12-31", "vote_count.gte": "50", "sort_by": "vote_count.desc" } },
                { title: "💿 2000-ні роки", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "without_original_language": "ru,be", "first_air_date.gte": "2000-01-01", "first_air_date.lte": "2009-12-31", "vote_count.gte": "50", "sort_by": "vote_count.desc" } },
                { title: "📼 1990-ті роки", url: "discover/tv", is_tv: true, params: { "without_genres": "16,10763,10764,10767", "without_original_language": "ru,be", "first_air_date.gte": "1990-01-01", "first_air_date.lte": "1999-12-31", "vote_count.gte": "30", "sort_by": "vote_count.desc" } }
            ]
        }
    };

    // --- ДОПОМІЖНІ ФУНКЦІЇ ---

    function hasAsianScript(text) {
        if (!text) return false;
        return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/.test(text);
    }

    function isAsianOrBlocked(item) {
        if (!item) return true;
        var lang = (item.original_language || '').toLowerCase();
        if (BLOCKED_LANGS.indexOf(lang) !== -1 || lang.indexOf('zh') === 0) return true;

        if (item.origin_country && Array.isArray(item.origin_country)) {
            for (var i = 0; i < item.origin_country.length; i++) {
                if (BLOCKED_COUNTRIES.indexOf(item.origin_country[i].toUpperCase()) !== -1) return true;
            }
        }
        return hasAsianScript(item.original_name) || hasAsianScript(item.original_title);
    }

    function resolveParamValue(val) {
        var d = new Date();
        if (val === '{current_date}') {
            return [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
        }
        if (val === '{one_year_ago}') {
            d.setFullYear(d.getFullYear() - 1);
            return [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
        }
        return val;
    }

    function fetchWithFallback(catUrl, catParams, isTv, page, filterAsian, callback) {
        var network = new Lampa.Reguest();

        function buildQuery(lang) {
            var params = ['api_key=' + Lampa.TMDB.key(), 'language=' + lang];
            if (page) params.push('page=' + page);
            if (catParams) {
                for (var key in catParams) {
                    params.push(key + '=' + resolveParamValue(catParams[key]));
                }
            }
            return Lampa.TMDB.api(catUrl + '?' + params.join('&'));
        }

        var urlUk = buildQuery(Lampa.Storage.get('language', 'uk'));

        network.silent(urlUk, function (jsonUk) {
            if (!jsonUk || !jsonUk.results || !jsonUk.results.length) return callback(jsonUk);

            jsonUk.results = jsonUk.results.filter(function (item) {
                if (isTv) {
                    item.media_type = 'tv';
                } else {
                    item.media_type = 'movie';
                    delete item.name;
                }
                if (filterAsian && isAsianOrBlocked(item)) return false;
                return !!item.poster_path;
            });

            var needsEnglish = jsonUk.results.some(function (item) {
                var title = item.name || item.title || '';
                return !title || hasAsianScript(title);
            });

            if (needsEnglish) {
                network.silent(buildQuery('en'), function (jsonEn) {
                    var enMap = {};
                    if (jsonEn && jsonEn.results) {
                        jsonEn.results.forEach(function (enItem) {
                            enMap[enItem.id] = enItem.name || enItem.title || '';
                        });
                    }

                    jsonUk.results.forEach(function (item) {
                        var title = item.name || item.title || '';
                        if (!title || hasAsianScript(title)) {
                            var enTitle = enMap[item.id];
                            var fallback = (enTitle && !hasAsianScript(enTitle)) ? enTitle : (item.original_name || item.original_title);
                            
                            if (fallback && !hasAsianScript(fallback)) {
                                if (isTv) {
                                    item.name = fallback;
                                    item.title = fallback;
                                } else {
                                    item.title = fallback;
                                    delete item.name;
                                }
                            }
                        }
                    });
                    callback(jsonUk);
                }, function () { callback(jsonUk); });
            } else {
                callback(jsonUk);
            }
        }, function () { callback(null); });
    }

    // --- ФАБРИКА КОМПОНЕНТІВ ---

    function createCatalogMain(cfgKey) {
        return function (object) {
            var comp = new Lampa.InteractionMain(object);
            var config = CONFIGS[cfgKey];

            comp.create = function () {
                var _this = this;
                this.activity.loader(true);
                var categories = config.categories;
                var status = new Lampa.Status(categories.length);

                status.onComplite = function () {
                    var fulldata = [];
                    Object.keys(status.data).sort(function (a, b) { return a - b; }).forEach(function (key) {
                        var data = status.data[key];
                        if (data && data.results && data.results.length) {
                            var cat = categories[parseInt(key)];
                            Lampa.Utils.extendItemsParams(data.results, { style: { name: 'wide' } });
                            fulldata.push({
                                title: cat.title,
                                results: data.results,
                                url: cat.url,
                                params: cat.params,
                                is_tv: cat.is_tv
                            });
                        }
                    });

                    if (fulldata.length) {
                        _this.build(fulldata);
                        _this.activity.loader(false);
                    } else {
                        _this.empty();
                    }
                };

                categories.forEach(function (cat, index) {
                    var isTv = typeof cat.is_tv !== 'undefined' ? cat.is_tv : (cfgKey === 'tv');
                    var filterAsian = cfgKey === 'western_anim';
                    fetchWithFallback(cat.url, cat.params, isTv, 1, filterAsian, function (json) {
                        if (json) status.append(index.toString(), json);
                        else status.error();
                    });
                });

                return this.render();
            };

            comp.onMore = function (data) {
                Lampa.Activity.push({
                    url: data.url,
                    params: data.params,
                    is_tv: data.is_tv,
                    title: data.title,
                    component: config.id + '_view',
                    page: 1
                });
            };

            return comp;
        };
    }

    function createCatalogView(cfgKey) {
        return function (object) {
            var comp = new Lampa.InteractionCategory(object);
            var isTv = typeof object.is_tv !== 'undefined' ? object.is_tv : (cfgKey === 'tv');
            var filterAsian = cfgKey === 'western_anim';

            comp.create = function () {
                var _this = this;
                fetchWithFallback(object.url, object.params, isTv, 1, filterAsian, function (json) {
                    if (json) _this.build(json);
                    else _this.empty();
                });
            };

            comp.nextPageReuest = function (objectData, resolve, reject) {
                fetchWithFallback(object.url, object.params, isTv, objectData.page, filterAsian, function (json) {
                    if (json) resolve(json);
                    else reject();
                });
            };

            return comp;
        };
    }

    // --- РЕЄСТРАЦІЯ ТА ИНІЦІАЛІЗАЦІЯ ---

    Object.keys(CONFIGS).forEach(function (key) {
        var cfg = CONFIGS[key];
        Lampa.Component.add(cfg.id + '_main', createCatalogMain(key));
        Lampa.Component.add(cfg.id + '_view', createCatalogView(key));
    });

    function addMenuButtons() {
        var menu = $('.menu .menu__list').eq(0);
        if (!menu.length) return;

        Object.keys(CONFIGS).forEach(function (key) {
            var cfg = CONFIGS[key];
            if (menu.find('.menu__item[data-action="' + cfg.id + '"]').length) return;

            var btn = $('<li class="menu__item selector" data-action="' + cfg.id + '">' +
                '<div class="menu__ico">' + cfg.icon + '</div>' +
                '<div class="menu__text">' + cfg.title + '</div>' +
            '</li>');

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: cfg.title,
                    component: cfg.id + '_main',
                    page: 1
                });
            });

            menu.append(btn);
        });
    }

    if (window.appready) {
        addMenuButtons();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') addMenuButtons();
        });
    }

    setInterval(function () {
        if (window.appready && $('.menu .menu__list').eq(0).length) {
            addMenuButtons();
        }
    }, 3000);

})();
