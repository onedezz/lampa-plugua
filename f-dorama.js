(function () {
    'use strict';

    /**
     * DORAMA MOVIES MASTER COLLECTION
     * Тільки азійські художні фільми (Корея та Японія). 
     * З фіксом відкриття карток (method: 'movie') та англійським фолбеком.
     */

    var DORAMA_MOVIES_CONFIG = {
        title: 'Дорафільми',
        icon: '<svg viewBox="0 0 24 24" fill="#9C27B0" xmlns="http://www.w3.org/2000/svg"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H9l2 4H8L6 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>',
        categories: [
            // --- 1. ТРЕНДИ ТА ХІТИ ---
            { 
                "title": "🔥 Культові Азійські Хіти (За весь час)", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "📈 Свіжі Тренди & Новинки (За рік)", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "5",
                    "sort_by": "popularity.desc" 
                } 
            },

            // --- 2. РЕГІОНАЛЬНІ ХІТИ ---
            { 
                "title": "🇰🇷 Корейське (K-Movies)", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_original_language": "ko", 
                    "vote_count.gte": "10",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🇯🇵 Японське (J-Movies)", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_original_language": "ja", 
                    "vote_count.gte": "10",
                    "sort_by": "vote_count.desc" 
                } 
            },

            // --- 3. ОКРЕМІ КІНОЖАНРИ ---
            { 
                "title": "⚔️ Бойовики", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_genres": "28", 
                    "with_original_language": "ja|ko", 
                    "vote_count.gte": "5",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🤠 Пригоди", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_genres": "12", 
                    "with_original_language": "ja|ko", 
                    "vote_count.gte": "5",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "😂 Комедії", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_genres": "35", 
                    "with_original_language": "ja|ko", 
                    "vote_count.gte": "5",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🚨 Кримінал", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_genres": "80", 
                    "with_original_language": "ja|ko", 
                    "vote_count.gte": "5",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🔎 Детективи", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_genres": "9648", 
                    "with_original_language": "ja|ko", 
                    "vote_count.gte": "5",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🎭 Драми", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_genres": "18", 
                    "with_original_language": "ja|ko", 
                    "vote_count.gte": "5",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "😱 Жахи", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_genres": "27", 
                    "with_original_language": "ja|ko", 
                    "vote_count.gte": "5",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🏛️ Історичні", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_genres": "36", 
                    "with_original_language": "ja|ko", 
                    "vote_count.gte": "3",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🎼 Музичні", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_genres": "10402", 
                    "with_original_language": "ja|ko", 
                    "vote_count.gte": "3",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "💖 Романтика / Мелодрами", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_genres": "10749", 
                    "with_original_language": "ja|ko", 
                    "vote_count.gte": "5",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "👨‍👩‍👧 Сімейні", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_genres": "10751", 
                    "with_original_language": "ja|ko", 
                    "vote_count.gte": "3",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🔪 Трилери", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_genres": "53", 
                    "with_original_language": "ja|ko", 
                    "vote_count.gte": "5",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🚀 Фантастика", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_genres": "878", 
                    "with_original_language": "ja|ko", 
                    "vote_count.gte": "5",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🧙‍♂️ Фентезі", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_genres": "14", 
                    "with_original_language": "ja|ko", 
                    "vote_count.gte": "5",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🎖️ Військові", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_genres": "10752", 
                    "with_original_language": "ja|ko", 
                    "vote_count.gte": "3",
                    "sort_by": "vote_count.desc" 
                } 
            },

            // --- 4. ДЕСЯТИЛІТТЯ ---
            { 
                "title": "⚡ Сучасний Період (2020-ті)", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "2020-01-01", 
                    "vote_count.gte": "5",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "💎 Ера Процвітання (2010-ті)", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "2010-01-01", 
                    "primary_release_date.lte": "2019-12-31", 
                    "vote_count.gte": "5",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "💿 Золота Класика (2000-ні)", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "2000-01-01", 
                    "primary_release_date.lte": "2009-12-31", 
                    "vote_count.gte": "5",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "📼 1990-ті", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "1990-01-01", 
                    "primary_release_date.lte": "1999-12-31", 
                    "vote_count.gte": "3",
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

    function normalizeItem(item, enTitle) {
        // Гарантуємо, що Lampa чітко знає тип контенту для маршрутизатора картки
        item.method = 'movie';
        item.media_type = 'movie';

        var ukTitle = item.title || item.name || '';
        
        if (!ukTitle || hasAsianScript(ukTitle)) {
            if (enTitle && !hasAsianScript(enTitle)) {
                item.title = enTitle;
                item.name = enTitle;
            } else if (item.original_title && !hasAsianScript(item.original_title)) {
                item.title = item.original_title;
                item.name = item.original_title;
            }
        }

        if (item.title) item.name = item.title;
        if (item.name) item.title = item.name;
    }

    function fetchWithFallback(urlUk, callback) {
        var network = new Lampa.Reguest();

        network.silent(urlUk, function (jsonUk) {
            if (!jsonUk || !jsonUk.results || !jsonUk.results.length) {
                return callback(jsonUk);
            }

            jsonUk.results = jsonUk.results.filter(function (item) {
                return item.poster_path;
            });

            var urlEn = urlUk.replace(/language=[^&]+/, 'language=en');
            
            network.silent(urlEn, function (jsonEn) {
                var enMap = {};
                if (jsonEn && jsonEn.results) {
                    jsonEn.results.forEach(function (enItem) {
                        enMap[enItem.id] = enItem.title || enItem.name || '';
                    });
                }

                jsonUk.results.forEach(function (item) {
                    normalizeItem(item, enMap[item.id]);
                });

                callback(jsonUk);
            }, function () {
                jsonUk.results.forEach(function (item) {
                    normalizeItem(item, null);
                });
                callback(jsonUk);
            });
        }, function () {
            callback(null);
        });
    }

    function DoramaMoviesMain(object) {
        var comp = new Lampa.InteractionMain(object);

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var categories = DORAMA_MOVIES_CONFIG.categories;
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
                var params = [];
                params.push('api_key=' + Lampa.TMDB.key());
                params.push('language=' + Lampa.Storage.get('language', 'uk'));

                if (cat.params) {
                    for (var key in cat.params) {
                        var val = cat.params[key];
                        val = resolveParamValue(val);
                        params.push(key + '=' + val);
                    }
                }

                var url = Lampa.TMDB.api(cat.url + '?' + params.join('&'));

                fetchWithFallback(url, function (json) {
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
                component: 'dorama_movies_view',
                page: 1
            });
        };

        return comp;
    }

    function DoramaMoviesView(object) {
        var comp = new Lampa.InteractionCategory(object);

        function buildUrl(page) {
            var params = [];
            params.push('api_key=' + Lampa.TMDB.key());
            params.push('language=' + Lampa.Storage.get('language', 'uk'));
            params.push('page=' + page);

            if (object.params) {
                for (var key in object.params) {
                    var val = object.params[key];
                    val = resolveParamValue(val);
                    params.push(key + '=' + val);
                }
            }
            return Lampa.TMDB.api(object.url + '?' + params.join('&'));
        }

        comp.create = function () {
            var _this = this;
            fetchWithFallback(buildUrl(1), function (json) {
                if (json) _this.build(json);
                else _this.empty();
            });
        };

        comp.nextPageReuest = function (object, resolve, reject) {
            fetchWithFallback(buildUrl(object.page), function (json) {
                if (json) resolve(json);
                else reject();
            });
        };

        return comp;
    }

    function startPlugin() {
        if (window.plugin_dorama_movies_ready) return;
        window.plugin_dorama_movies_ready = true;

        Lampa.Component.add('dorama_movies_main', DoramaMoviesMain);
        Lampa.Component.add('dorama_movies_view', DoramaMoviesView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="dorama_movies"]').length) return;

            var btn = $(`<li class="menu__item selector" data-action="dorama_movies">
                <div class="menu__ico">${DORAMA_MOVIES_CONFIG.icon}</div>
                <div class="menu__text">${DORAMA_MOVIES_CONFIG.title}</div>
            </li>`);

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: DORAMA_MOVIES_CONFIG.title,
                    component: 'dorama_movies_main',
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

    if (!window.plugin_dorama_movies_ready) startPlugin();
})();
