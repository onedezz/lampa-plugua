(function () {
    'use strict';

    /**
     * UKRAINIAN CINEMA MASTER COLLECTION
     * Ukrainian & Soviet-era Ukrainian Cinema Tab with RU Fallback
     */

    var UA_CINEMA_CONFIG = {
        title: 'UA Кіноспадщина',
        icon: '<svg viewBox="0 0 24 24" fill="#FFD700" xmlns="http://www.w3.org/2000/svg"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" fill="#0057B7"/><path d="M4 10h16v8H4z" fill="#FFD700"/></svg>',
        categories: [
            // --- ОСНОВНІ ТРЕНДИ ---
            { 
                "title": "🔥 TV Тренди (Останні 90 днів)", 
                "url": "discover/tv", 
                "params": { 
                    "with_origin_country": "UA", 
                    "air_date.gte": "{ninety_days_ago}", 
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🎬 Трендові фільми (За рік)", 
                "url": "discover/movie", 
                "params": { 
                    "with_origin_country": "UA", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "sort_by": "popularity.desc" 
                } 
            },

            // --- ДЕСЯТИЛІТТЯ (ВІД СУЧАСНИХ ДО СТАРИХ) ---
            { 
                "title": "⚡ Сучасний Період 2020-х — Серіали", 
                "url": "discover/tv", 
                "params": { 
                    "with_origin_country": "UA", 
                    "first_air_date.gte": "2020-01-01", 
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "⚡ Сучасний Період 2020-х — Фільми", 
                "url": "discover/movie", 
                "params": { 
                    "with_origin_country": "UA", 
                    "primary_release_date.gte": "2020-01-01", 
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "💎 Ера 2010-х — Серіали", 
                "url": "discover/tv", 
                "params": { 
                    "with_origin_country": "UA", 
                    "first_air_date.gte": "2010-01-01", 
                    "first_air_date.lte": "2019-12-31", 
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "💎 Ера 2010-х — Фільми", 
                "url": "discover/movie", 
                "params": { 
                    "with_origin_country": "UA", 
                    "primary_release_date.gte": "2010-01-01", 
                    "primary_release_date.lte": "2019-12-31", 
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "💿 2000-ні — Серіали", 
                "url": "discover/tv", 
                "params": { 
                    "with_origin_country": "UA", 
                    "first_air_date.gte": "2000-01-01", 
                    "first_air_date.lte": "2009-12-31", 
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "💿 2000-ні — Фільми", 
                "url": "discover/movie", 
                "params": { 
                    "with_origin_country": "UA", 
                    "primary_release_date.gte": "2000-01-01", 
                    "primary_release_date.lte": "2009-12-31", 
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "📼 1990-ті — Серіали", 
                "url": "discover/tv", 
                "params": { 
                    "with_origin_country": "UA", 
                    "first_air_date.gte": "1990-01-01", 
                    "first_air_date.lte": "1999-12-31", 
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "📼 1990-ті — Фільми", 
                "url": "discover/movie", 
                "params": { 
                    "with_origin_country": "UA", 
                    "primary_release_date.gte": "1990-01-01", 
                    "primary_release_date.lte": "1999-12-31", 
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🏛️ Класика та Легенди (до 1990 року) — Серіали", 
                "url": "discover/tv", 
                "params": { 
                    "with_origin_country": "UA|SU", 
                    "first_air_date.lte": "1989-12-31", 
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🏛️ Класика та Легенди (до 1990 року) — Фільми", 
                "url": "discover/movie", 
                "params": { 
                    "with_origin_country": "UA|SU", 
                    "primary_release_date.lte": "1989-12-31", 
                    "sort_by": "popularity.desc" 
                } 
            }
        ]
    };

    // Перевіряємо, чи повернулася назва англійською/латиницею (якщо немає українського перекладу в TMDB)
    function hasLatinScript(text) {
        if (!text) return false;
        return /[a-zA-Z]/.test(text);
    }

    function resolveParamValue(val) {
        var d = new Date();
        if (val === '{current_date}') {
            return [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
        }
        if (val === '{ninety_days_ago}') {
            d.setDate(d.getDate() - 90);
            return [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
        }
        if (val === '{one_year_ago}') {
            d.setFullYear(d.getFullYear() - 1);
            return [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
        }
        return val;
    }

    // Запит із фолбеком на російську мову (ru), якщо українською назва видана латиницею
    function fetchWithFallback(urlUk, callback) {
        var network = new Lampa.Reguest();

        network.silent(urlUk, function (jsonUk) {
            if (!jsonUk || !jsonUk.results || !jsonUk.results.length) {
                return callback(jsonUk);
            }

            // Відсіюємо картки без постерів
            jsonUk.results = jsonUk.results.filter(function (item) {
                return item.poster_path;
            });

            // Якщо назва англійською — робимо фолбек на RU
            var needRussian = jsonUk.results.some(function (item) {
                var title = item.title || item.name || '';
                return hasLatinScript(title);
            });

            if (needRussian) {
                var urlRu = urlUk.replace('language=uk', 'language=ru');
                network.silent(urlRu, function (jsonRu) {
                    if (jsonRu && jsonRu.results) {
                        jsonUk.results.forEach(function (item, idx) {
                            var title = item.title || item.name || '';
                            if (hasLatinScript(title) && jsonRu.results[idx]) {
                                var ruTitle = jsonRu.results[idx].title || jsonRu.results[idx].name;
                                if (ruTitle) {
                                    if (item.title) item.title = ruTitle;
                                    if (item.name) item.name = ruTitle;
                                }
                            }
                        });
                    }
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

    function UaCinemaMain(object) {
        var comp = new Lampa.InteractionMain(object);

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var categories = UA_CINEMA_CONFIG.categories;
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
                component: 'ua_cinema_view',
                page: 1
            });
        };

        return comp;
    }

    function UaCinemaView(object) {
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
        if (window.plugin_ua_cinema_ready) return;
        window.plugin_ua_cinema_ready = true;

        Lampa.Component.add('ua_cinema_main', UaCinemaMain);
        Lampa.Component.add('ua_cinema_view', UaCinemaView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="ua_cinema_master"]').length) return;

            var btn = $(`<li class="menu__item selector" data-action="ua_cinema_master">
                <div class="menu__ico">${UA_CINEMA_CONFIG.icon}</div>
                <div class="menu__text">${UA_CINEMA_CONFIG.title}</div>
            </li>`);

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: UA_CINEMA_CONFIG.title,
                    component: 'ua_cinema_main',
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

    if (!window.plugin_ua_cinema_ready) startPlugin();
})();
