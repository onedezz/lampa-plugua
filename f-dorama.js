(function () {
    'use strict';

    /**
     * MOVIES MASTER CATALOG FOR LAMPA
     * Категорія "Фільми" з англійським фолбеком для ієрогліфів та нативним відкриттям карток.
     */

    var MOVIES_CONFIG = {
        title: 'Фільми',
        icon: '<svg viewBox="0 0 24 24" fill="#E91E63" xmlns="http://www.w3.org/2000/svg"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H9l2 4H8L6 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>',
        categories: [
            // --- 1. СВІЖАЧОК ---
            { 
                "title": "🔥 Свіжачок (За рік)", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "10",
                    "sort_by": "popularity.desc" 
                } 
            },

            // --- 2. КУЛЬТОВІ ЗІ СВІТУ ---
            { 
                "title": "🗽 Культові Американські та Канадські фільми", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_origin_country": "US|CA",
                    "vote_count.gte": "300",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🇪🇺 Культові Європейські фільми", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_origin_country": "GB|FR|DE|IT|ES|SE|DK|NO|PL",
                    "vote_count.gte": "150",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🌏 Культові Азійські фільми (Корея, Японія, Китай)", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_original_language": "ko|ja|zh|cn",
                    "vote_count.gte": "50",
                    "sort_by": "vote_count.desc" 
                } 
            },

            // --- 3. ВСІ ОФІЦІЙНІ КІНОЖАНРИ (ОКРЕМО) ---
            { 
                "title": "⚔️ Бойовики", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_genres": "28", 
                    "vote_count.gte": "100",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🤠 Пригоди", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_genres": "12", 
                    "vote_count.gte": "100",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "😂 Комедії", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_genres": "35", 
                    "vote_count.gte": "100",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🚨 Кримінал", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_genres": "80", 
                    "vote_count.gte": "100",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🔎 Детективи", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_genres": "9648", 
                    "vote_count.gte": "100",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🎭 Драми", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_genres": "18", 
                    "vote_count.gte": "100",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "😱 Жахи", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_genres": "27", 
                    "vote_count.gte": "100",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🏛️ Історичні", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_genres": "36", 
                    "vote_count.gte": "50",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🎼 Музичні", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_genres": "10402", 
                    "vote_count.gte": "50",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "💖 Романтика / Мелодрами", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_genres": "10749", 
                    "vote_count.gte": "100",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "👨‍👩‍👧 Сімейні", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_genres": "10751", 
                    "vote_count.gte": "50",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🔪 Трилери", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_genres": "53", 
                    "vote_count.gte": "100",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🚀 Фантастика", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_genres": "878", 
                    "vote_count.gte": "100",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🧙‍♂️ Фентезі", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_genres": "14", 
                    "vote_count.gte": "100",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🎖️ Військові", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "with_genres": "10752", 
                    "vote_count.gte": "50",
                    "sort_by": "vote_count.desc" 
                } 
            },

            // --- 4. ДЕСЯТИЛІТТЯ ---
            { 
                "title": "⚡ 2020-ті роки", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "primary_release_date.gte": "2020-01-01", 
                    "vote_count.gte": "50",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "💎 2010-ті роки", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "primary_release_date.gte": "2010-01-01", 
                    "primary_release_date.lte": "2019-12-31", 
                    "vote_count.gte": "100",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "💿 2000-ні роки", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "primary_release_date.gte": "2000-01-01", 
                    "primary_release_date.lte": "2009-12-31", 
                    "vote_count.gte": "100",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "📼 1990-ті роки", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": "ru,be",
                    "primary_release_date.gte": "1990-01-01", 
                    "primary_release_date.lte": "1999-12-31", 
                    "vote_count.gte": "100",
                    "sort_by": "vote_count.desc" 
                } 
            }
        ]
    };

    function hasAsianScript(text) {
        if (!text) return false;
        return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/.test(text);
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

    function fetchWithFallback(catUrl, catParams, page, callback) {
        var network = new Lampa.Reguest();
        
        function buildQuery(lang) {
            var params = [];
            params.push('api_key=' + Lampa.TMDB.key());
            params.push('language=' + lang);
            if (page) params.push('page=' + page);

            if (catParams) {
                for (var key in catParams) {
                    var val = catParams[key];
                    val = resolveParamValue(val);
                    params.push(key + '=' + val);
                }
            }
            return Lampa.TMDB.api(catUrl + '?' + params.join('&'));
        }

        var urlUk = buildQuery(Lampa.Storage.get('language', 'uk'));

        network.silent(urlUk, function (jsonUk) {
            if (!jsonUk || !jsonUk.results || !jsonUk.results.length) {
                return callback(jsonUk);
            }

            // Залишаємо тільки позиції з постерами та виставляємо маркер типу
            jsonUk.results = jsonUk.results.filter(function (item) {
                item.method = 'movie';
                item.media_type = 'movie';
                return item.poster_path;
            });

            // Перевіряємо, чи є ієрогліфи замість зрозумілої назви
            var needsEnglish = jsonUk.results.some(function (item) {
                var title = item.title || item.name || '';
                return !title || hasAsianScript(title);
            });

            if (needsEnglish) {
                var urlEn = buildQuery('en');
                network.silent(urlEn, function (jsonEn) {
                    var enMap = {};
                    if (jsonEn && jsonEn.results) {
                        jsonEn.results.forEach(function (enItem) {
                            enMap[enItem.id] = enItem.title || enItem.name || '';
                        });
                    }

                    jsonUk.results.forEach(function (item) {
                        var title = item.title || item.name || '';
                        if (!title || hasAsianScript(title)) {
                            var enTitle = enMap[item.id];
                            if (enTitle && !hasAsianScript(enTitle)) {
                                item.title = enTitle;
                                item.name = enTitle;
                            } else if (item.original_title && !hasAsianScript(item.original_title)) {
                                item.title = item.original_title;
                                item.name = item.original_title;
                            }
                        }
                    });

                    callback(jsonUk);
                }, function () {
                    callback(jsonUk);
                });
            } else {
                callback(jsonUk);
            }
        }, function () {
            callback(null);
        });
    }

    function MoviesMain(object) {
        var comp = new Lampa.InteractionMain(object);

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var categories = MOVIES_CONFIG.categories;
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
                            params: cat.params
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
                fetchWithFallback(cat.url, cat.params, 1, function (json) {
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
                title: data.title,
                component: 'movies_catalog_view',
                page: 1
            });
        };

        return comp;
    }

    function MoviesView(object) {
        var comp = new Lampa.InteractionCategory(object);

        comp.create = function () {
            var _this = this;
            fetchWithFallback(object.url, object.params, 1, function (json) {
                if (json) _this.build(json);
                else _this.empty();
            });
        };

        comp.nextPageReuest = function (objectData, resolve, reject) {
            fetchWithFallback(object.url, object.params, objectData.page, function (json) {
                if (json) resolve(json);
                else reject();
            });
        };

        return comp;
    }

    function startPlugin() {
        if (window.plugin_movies_catalog_ready) return;
        window.plugin_movies_catalog_ready = true;

        Lampa.Component.add('movies_catalog_main', MoviesMain);
        Lampa.Component.add('movies_catalog_view', MoviesView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="movies_catalog"]').length) return;

            var btn = $(`<li class="menu__item selector" data-action="movies_catalog">
                <div class="menu__ico">${MOVIES_CONFIG.icon}</div>
                <div class="menu__text">${MOVIES_CONFIG.title}</div>
            </li>`);

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: MOVIES_CONFIG.title,
                    component: 'movies_catalog_main',
                    page: 1
                });
            });

            menu.append(btn);
        }

        if (window.appready) {
            addMenuButton();
        } else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type == 'ready') addMenuButton();
            });
        }

        setInterval(function () {
            if (window.appready && $('.menu .menu__list').eq(0).length) {
                addMenuButton();
            }
        }, 3000);
    }

    if (!window.plugin_movies_catalog_ready) startPlugin();
})();
