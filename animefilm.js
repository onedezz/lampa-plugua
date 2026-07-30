(function () {
    'use strict';

    /**
     * ANIME MOVIES MASTER COLLECTION
     * Japanese & Korean Feature Anime Movies with 1-Year Genre Window
     */

    var ANIME_MOVIES_CONFIG = {
        title: 'Аніме фільми',
        icon: '<svg viewBox="0 0 24 24" fill="#FF5722" xmlns="http://www.w3.org/2000/svg"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8V7h8v2z"/></svg>',
        categories: [
            // --- ГОЛОВНІ ТРЕНДИ ---
            { 
                "title": "🔥 Тренди", 
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

            // --- ЖАНРИ ЗА ОСТАННІЙ РІК ---
            { 
                "title": "⚔️ Екшн", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,28", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🤠 Пригоди", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,12", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🚀 Фантастика", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,878", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🧙‍♂️ Фентезі", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,14", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🔪 Трилери", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,53", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🔎 Детективи", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,9648", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "😱 Жахи", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,27", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "😂 Комедії", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,35", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🎭 Драми", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,18", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🕵️ Кримінал", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,80", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "⚔️ Військові", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,10752", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "📜 Історичні", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,36", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "💖 Романтика", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,10749", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "👨‍👩‍👧 Сімейне", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,10751", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🎼 Музичні", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,10402", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "3",
                    "sort_by": "popularity.desc" 
                } 
            },

            // --- НАЙКРАЩІ ЗА ДЕСЯТИЛІТТЯ ---
            { 
                "title": "⚡ Сучасний Період 2020-х (Найкраще)", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "2020-01-01", 
                    "vote_average.gte": "7.0",
                    "vote_count.gte": "50",
                    "sort_by": "vote_average.desc" 
                } 
            },
            { 
                "title": "💎 Ера 2010-х (Найкраще)", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "2010-01-01", 
                    "primary_release_date.lte": "2019-12-31", 
                    "vote_average.gte": "7.5",
                    "vote_count.gte": "100",
                    "sort_by": "vote_average.desc" 
                } 
            },
            { 
                "title": "💿 Культові 2000-ні (Найкраще)", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "2000-01-01", 
                    "primary_release_date.lte": "2009-12-31", 
                    "vote_average.gte": "7.5",
                    "vote_count.gte": "100",
                    "sort_by": "vote_average.desc" 
                } 
            },
            { 
                "title": "📼 Золота ера 1990-х (Найкраще)", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.gte": "1990-01-01", 
                    "primary_release_date.lte": "1999-12-31", 
                    "vote_average.gte": "7.5",
                    "vote_count.gte": "50",
                    "sort_by": "vote_average.desc" 
                } 
            },
            { 
                "title": "🏛️ Класика та Легенди (до 1990 року)", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "ja|ko", 
                    "primary_release_date.lte": "1989-12-31", 
                    "vote_average.gte": "7.0",
                    "vote_count.gte": "30",
                    "sort_by": "vote_average.desc" 
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

    function fetchWithFallback(urlUk, callback) {
        var network = new Lampa.Reguest();

        network.silent(urlUk, function (jsonUk) {
            if (!jsonUk || !jsonUk.results || !jsonUk.results.length) {
                return callback(jsonUk);
            }

            // Відсіюємо анонси без обкладинок
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

    function AnimeMoviesMain(object) {
        var comp = new Lampa.InteractionMain(object);

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var categories = ANIME_MOVIES_CONFIG.categories;
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
                component: 'anime_movies_view',
                page: 1
            });
        };

        return comp;
    }

    function AnimeMoviesView(object) {
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
        if (window.plugin_anime_movies_master_ready) return;
        window.plugin_anime_movies_master_ready = true;

        Lampa.Component.add('anime_movies_main', AnimeMoviesMain);
        Lampa.Component.add('anime_movies_view', AnimeMoviesView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="anime_movies_master"]').length) return;

            var btn = $(`<li class="menu__item selector" data-action="anime_movies_master">
                <div class="menu__ico">${ANIME_MOVIES_CONFIG.icon}</div>
                <div class="menu__text">${ANIME_MOVIES_CONFIG.title}</div>
            </li>`);

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: ANIME_MOVIES_CONFIG.title,
                    component: 'anime_movies_main',
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

    if (!window.plugin_anime_movies_master_ready) startPlugin();
})();
