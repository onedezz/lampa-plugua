(function () {
    'use strict';

    /**
     * WORLD MOVIES MASTER COLLECTION (Expanded Genres)
     * Excludes Animation, UA, RU, BY, IN, CN, KR cinema.
     */

    var EXCLUDED_LANGS = ['ru', 'uk', 'be', 'hi', 'ta', 'te', 'ml', 'kn', 'zh', 'ko'];

    var MOVIES_CONFIG = {
        title: 'Фільми',
        icon: '<svg viewBox="0 0 24 24" fill="#2196F3" xmlns="http://www.w3.org/2000/svg"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8V7h8v2z"/></svg>',
        categories: [
            // --- ТРЕНДИ ТА ПОПУЛЯРНЕ ---
            { 
                "title": "🔥 Тренди (Останні 90 днів)", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "primary_release_date.gte": "{ninety_days_ago}", 
                    "vote_count.gte": "10",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🎬 Популярне за рік", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "50",
                    "sort_by": "popularity.desc" 
                } 
            },

            // --- РОЗШИРЕНІ ЖАНРИ ---
            { 
                "title": "⚔️ Бойовики та Екшн", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "28", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "100",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🚀 Фантастика", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "878", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "100",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🧙‍♂️ Фентезі та Магія", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "14", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "100",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🔪 Трилери", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "53", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "100",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🔎 Детективи", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "9648", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "80",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "😱 Жахи", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "27", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "50",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "😂 Комедії", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "35", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "100",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🎭 Драми", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "18", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "100",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🤠 Пригоди", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "12", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "100",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🕵️ Кримінал", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "80", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "100",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "⚔️ Військові фільми", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "10752", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "80",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "📜 Біографія та Історія", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "36", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "80",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "💖 Мелодрами та Романтика", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "10749", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "80",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "👨‍👩‍👧 Сімейне кіно (Художнє)", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "10751", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "80",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🌵 Вестерни", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "37", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "30",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🎼 Музика та Мюзикли", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "10402", 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "vote_count.gte": "50",
                    "sort_by": "popularity.desc" 
                } 
            },

            // --- НАЙКРАЩІ ЗА ДЕСЯТИЛІТТЯ (З ВИСОКИМ РЕЙТИНГОМ) ---
            { 
                "title": "⚡ Сучасний Період 2020-х (Найкраще)", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "primary_release_date.gte": "2020-01-01", 
                    "vote_average.gte": "7.0",
                    "vote_count.gte": "300",
                    "sort_by": "vote_average.desc" 
                } 
            },
            { 
                "title": "💎 Ера 2010-х (Найкраще)", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "primary_release_date.gte": "2010-01-01", 
                    "primary_release_date.lte": "2019-12-31", 
                    "vote_average.gte": "7.5",
                    "vote_count.gte": "500",
                    "sort_by": "vote_average.desc" 
                } 
            },
            { 
                "title": "💿 Культові 2000-ні (Найкраще)", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "primary_release_date.gte": "2000-01-01", 
                    "primary_release_date.lte": "2009-12-31", 
                    "vote_average.gte": "7.5",
                    "vote_count.gte": "500",
                    "sort_by": "vote_average.desc" 
                } 
            },
            { 
                "title": "📼 Золота ера 1990-х (Найкраще)", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "primary_release_date.gte": "1990-01-01", 
                    "primary_release_date.lte": "1999-12-31", 
                    "vote_average.gte": "7.5",
                    "vote_count.gte": "500",
                    "sort_by": "vote_average.desc" 
                } 
            },
            { 
                "title": "🏛️ Класика Кінематографа (до 1990 року)", 
                "url": "discover/movie", 
                "params": { 
                    "without_genres": "16", 
                    "without_original_language": EXCLUDED_LANGS.join(','), 
                    "primary_release_date.lte": "1989-12-31", 
                    "vote_average.gte": "7.5",
                    "vote_count.gte": "300",
                    "sort_by": "vote_average.desc" 
                } 
            }
        ]
    };

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

            // Жорсткий JS-фільтр: без постерів, без анімації (genre 16) та без некоректних мов
            jsonUk.results = jsonUk.results.filter(function (item) {
                if (!item.poster_path) return false;
                if (item.genre_ids && item.genre_ids.indexOf(16) !== -1) return false;
                if (item.original_language && EXCLUDED_LANGS.indexOf(item.original_language) !== -1) return false;
                return true;
            });

            // Перевіряємо, чи є тайтли без українського перекладу
            var needEnglish = jsonUk.results.some(function (item) {
                return !item.title;
            });

            if (needEnglish) {
                var urlEn = urlUk.replace('language=uk', 'language=en');
                network.silent(urlEn, function (jsonEn) {
                    if (jsonEn && jsonEn.results) {
                        jsonUk.results.forEach(function (item, idx) {
                            if (!item.title && jsonEn.results[idx]) {
                                var enTitle = jsonEn.results[idx].title || jsonEn.results[idx].name;
                                if (enTitle) item.title = enTitle;
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
                component: 'movies_view',
                page: 1
            });
        };

        return comp;
    }

    function MoviesView(object) {
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
        if (window.plugin_movies_master_ready) return;
        window.plugin_movies_master_ready = true;

        Lampa.Component.add('movies_main', MoviesMain);
        Lampa.Component.add('movies_view', MoviesView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="movies_master"]').length) return;

            var btn = $(`<li class="menu__item selector" data-action="movies_master">
                <div class="menu__ico">${MOVIES_CONFIG.icon}</div>
                <div class="menu__text">${MOVIES_CONFIG.title}</div>
            </li>`);

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: MOVIES_CONFIG.title,
                    component: 'movies_main',
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

    if (!window.plugin_movies_master_ready) startPlugin();
})();
