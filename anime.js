(function () {
    'use strict';

    /**
     * ANIME MASTER COLLECTION (Smart Popularity & Anti-Trash Filter)
     */

    var ANIME_CONFIG = {
        title: 'Аніме',
        icon: '<svg viewBox="0 0 24 24" fill="#FF6F00" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
        categories: [
            // --- ОСНОВНІ ТРЕНДИ (90 ДНІВ ДЛЯ TV) ---
            { 
                "title": "🔥 TV Тренди (Останні 90 днів)", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "air_date.gte": "{ninety_days_ago}", 
                    "vote_count.gte": "2",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🎬 Трендові фільми (За рік)", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },

            // --- ДЕСЯТИЛІТТЯ (ПОПУЛЯРНІСТЬ У МЕЖАХ ЕПОХИ + ВІДСІЮВАННЯ СПАМУ) ---
            { 
                "title": "⚡ Сучасний Період 2020-х — Серіали", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "first_air_date.gte": "2020-01-01", 
                    "vote_count.gte": "5",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "⚡ Сучасний Період 2020-х — Фільми", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "2020-01-01", 
                    "vote_count.gte": "5",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "💎 Ера Процвітання 2010-х — Серіали", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "first_air_date.gte": "2010-01-01", 
                    "first_air_date.lte": "2019-12-31", 
                    "vote_count.gte": "5",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "💎 Ера Процвітання 2010-х — Фільми", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "2010-01-01", 
                    "primary_release_date.lte": "2019-12-31", 
                    "vote_count.gte": "5",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "💿 Культові 2000-ні — Серіали", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "first_air_date.gte": "2000-01-01", 
                    "first_air_date.lte": "2009-12-31", 
                    "vote_count.gte": "5",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "💿 Культові 2000-ні — Фільми", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "2000-01-01", 
                    "primary_release_date.lte": "2009-12-31", 
                    "vote_count.gte": "5",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "📼 Золота ера 1990-х — Серіали", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "first_air_date.gte": "1990-01-01", 
                    "first_air_date.lte": "1999-12-31", 
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "📼 Золота ера 1990-х — Фільми", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "1990-01-01", 
                    "primary_release_date.lte": "1999-12-31", 
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🏛️ Класика та Легенди (до 1990 року) — Серіали", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "first_air_date.lte": "1989-12-31", 
                    "vote_count.gte": "2",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🏛️ Класика та Легенди (до 1990 року) — Фільми", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.lte": "1989-12-31", 
                    "vote_count.gte": "2",
                    "sort_by": "popularity.desc" 
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

    function fetchWithFallback(urlUk, callback) {
        var network = new Lampa.Reguest();

        network.silent(urlUk, function (jsonUk) {
            if (!jsonUk || !jsonUk.results || !jsonUk.results.length) {
                return callback(jsonUk);
            }

            // 1. ЖОРСТКИЙ ФІЛЬТР ПОСТЕРА: прибираємо тайтли без обкладинки
            jsonUk.results = jsonUk.results.filter(function (item) {
                return item.poster_path;
            });

            var needEnglish = jsonUk.results.some(function (item) {
                var title = item.title || item.name || '';
                return hasAsianScript(title);
            });

            if (needEnglish) {
                var urlEn = urlUk.replace('language=uk', 'language=en');
                network.silent(urlEn, function (jsonEn) {
                    if (jsonEn && jsonEn.results) {
                        jsonUk.results.forEach(function (item, idx) {
                            var title = item.title || item.name || '';
                            if (hasAsianScript(title) && jsonEn.results[idx]) {
                                var enTitle = jsonEn.results[idx].title || jsonEn.results[idx].name;
                                if (enTitle) {
                                    if (item.title) item.title = enTitle;
                                    if (item.name) item.name = enTitle;
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

    function AnimeMain(object) {
        var comp = new Lampa.InteractionMain(object);

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var categories = ANIME_CONFIG.categories;
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
                component: 'anime_view',
                page: 1
            });
        };

        return comp;
    }

    function AnimeView(object) {
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
        if (window.plugin_anime_master_ready) return;
        window.plugin_anime_master_ready = true;

        Lampa.Component.add('anime_main', AnimeMain);
        Lampa.Component.add('anime_view', AnimeView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="anime_master"]').length) return;

            var btn = $(`<li class="menu__item selector" data-action="anime_master">
                <div class="menu__ico">${ANIME_CONFIG.icon}</div>
                <div class="menu__text">${ANIME_CONFIG.title}</div>
            </li>`);

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: ANIME_CONFIG.title,
                    component: 'anime_main',
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

    if (!window.plugin_anime_master_ready) startPlugin();
})();
