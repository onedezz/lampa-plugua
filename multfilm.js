(function () {
    'use strict';

    /**
     * ANIMATED FEATURE MOVIES - TRAKT.TV ENGINE
     * Complete Movies Collection with Trakt API & TMDB Localization
     */

    var TRAKT_CLIENT_ID = '_vvIvZYJAxb7NikomG3qIfBcUCnMGwf1M7A-rqCLgCc';
    var EXCLUDED_LANGS = ['ru', 'be', 'ja', 'ko', 'zh'];
    var EXCLUDED_COUNTRIES = ['ru', 'by', 'jp', 'kr', 'cn'];

    var currentYear = new Date().getFullYear();
    var lastYear = currentYear - 1;
    var yearRangeOneYear = lastYear + '-' + currentYear;

    var TRAKT_CONFIG = {
        title: 'Мультфільми',
        icon: '<svg viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>',
        categories: [
            // --- 1. ПОПУЛЯРНЕ ТА ТРЕНДИ ---
            { title: "⭐ Популярне", url: "https://api.trakt.tv/movies/popular?genres=animation&limit=30" },
            { title: "📈 Тренди", url: "https://api.trakt.tv/movies/trending?genres=animation&limit=30" },

            // --- 2. ЖАНРИ ЗА ОСТАННІЙ 1 РІК ---
            { title: "🤠 Пригоди та Екшн (За рік)", url: "https://api.trakt.tv/movies/popular?genres=animation,action,adventure&years=" + yearRangeOneYear + "&limit=30" },
            { title: "🚀 Фантастика (За рік)", url: "https://api.trakt.tv/movies/popular?genres=animation,science-fiction&years=" + yearRangeOneYear + "&limit=30" },
            { title: "🧙‍♂️ Фентезі (За рік)", url: "https://api.trakt.tv/movies/popular?genres=animation,fantasy&years=" + yearRangeOneYear + "&limit=30" },
            { title: "😂 Комедії (За рік)", url: "https://api.trakt.tv/movies/popular?genres=animation,comedy&years=" + yearRangeOneYear + "&limit=30" },
            { title: "🎭 Драми та Душевні (За рік)", url: "https://api.trakt.tv/movies/popular?genres=animation,drama&years=" + yearRangeOneYear + "&limit=30" },
            { title: "🔎 Детективи та Містика (За рік)", url: "https://api.trakt.tv/movies/popular?genres=animation,mystery&years=" + yearRangeOneYear + "&limit=30" },
            { title: "👨‍👩‍👧 Сімейні (За рік)", url: "https://api.trakt.tv/movies/popular?genres=animation,family&years=" + yearRangeOneYear + "&limit=30" },

            // --- 3. ДЕСЯТИЛІТТЯ (ЗА ПОПУЛЯРНІСТЮ) ---
            { title: "⚡ Сучасність 2020-х", url: "https://api.trakt.tv/movies/popular?genres=animation&years=2020-" + currentYear + "&limit=30" },
            { title: "💎 Ера 2010-х", url: "https://api.trakt.tv/movies/popular?genres=animation&years=2010-2019&limit=30" },
            { title: "💿 Культові 2000-ні", url: "https://api.trakt.tv/movies/popular?genres=animation&years=2000-2009&limit=30" },
            { title: "📼 1990-ті", url: "https://api.trakt.tv/movies/popular?genres=animation&years=1990-1999&limit=30" },
            { title: "🏛️ Класика (до 1990 року)", url: "https://api.trakt.tv/movies/popular?genres=animation&years=1900-1989&limit=30" }
        ]
    };

    function isUnwanted(movie) {
        if (!movie) return true;
        var lang = (movie.language || '').toLowerCase();
        var country = (movie.country || '').toLowerCase();

        if (EXCLUDED_LANGS.indexOf(lang) !== -1) return true;
        if (EXCLUDED_COUNTRIES.indexOf(country) !== -1) return true;
        return false;
    }

    // Підтягуємо дані з TMDB для фільмів та перевіряємо Animation (ID 16)
    function enrichItemsWithTMDB(items, callback) {
        var network = new Lampa.Reguest();
        var lang = Lampa.Storage.get('language', 'uk');
        var enriched = [];
        var count = 0;

        if (!items || !items.length) return callback([]);

        items.forEach(function (traktItem, index) {
            var movie = traktItem.movie || traktItem;
            var tmdbId = movie.ids ? movie.ids.tmdb : null;

            if (!tmdbId || isUnwanted(movie)) {
                count++;
                if (count === items.length) callback(enriched.filter(Boolean));
                return;
            }

            var tmdbUrl = Lampa.TMDB.api('movie/' + tmdbId + '?api_key=' + Lampa.TMDB.key() + '&language=' + lang);

            network.silent(tmdbUrl, function (tmdbData) {
                if (tmdbData && tmdbData.poster_path) {
                    var isAnimation = tmdbData.genres && tmdbData.genres.some(function (g) { return g.id === 16; });
                    var isAsianLang = EXCLUDED_LANGS.indexOf(tmdbData.original_language) !== -1;

                    if (isAnimation && !isAsianLang) {
                        enriched[index] = {
                            id: tmdbData.id,
                            title: tmdbData.title || movie.title,
                            original_title: tmdbData.original_title || movie.title,
                            overview: tmdbData.overview || movie.overview || '',
                            poster_path: tmdbData.poster_path,
                            vote_average: tmdbData.vote_average || movie.rating || 0,
                            release_date: tmdbData.release_date || movie.released || '',
                            method: 'movie'
                        };
                    }
                }
                count++;
                if (count === items.length) callback(enriched.filter(Boolean));
            }, function () {
                count++;
                if (count === items.length) callback(enriched.filter(Boolean));
            });
        });
    }

    function fetchTraktPage(baseUrl, page, callback) {
        var pageUrl = baseUrl + '&page=' + page;
        $.ajax({
            url: pageUrl,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': TRAKT_CLIENT_ID
            },
            success: function (response) {
                var rawList = Array.isArray(response) ? response : [];
                enrichItemsWithTMDB(rawList, function (formattedResults) {
                    callback({
                        results: formattedResults,
                        page: page,
                        total_pages: 50
                    });
                });
            },
            error: function () {
                callback(null);
            }
        });
    }

    function TraktAnimatedMoviesMain(object) {
        var comp = new Lampa.InteractionMain(object);

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var categories = TRAKT_CONFIG.categories;
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
                            url: cat.url
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
                fetchTraktPage(cat.url, 1, function (data) {
                    if (data && data.results) status.append(index.toString(), data);
                    else status.error();
                });
            });

            return this.render();
        };

        comp.onMore = function (data) {
            Lampa.Activity.push({
                url: data.url,
                title: data.title,
                component: 'trakt_multfilm_view',
                page: 1
            });
        };

        return comp;
    }

    function TraktAnimatedMoviesView(object) {
        var comp = new Lampa.InteractionCategory(object);

        comp.create = function () {
            var _this = this;
            fetchTraktPage(object.url, 1, function (json) {
                if (json && json.results && json.results.length) {
                    _this.build(json);
                } else {
                    _this.empty();
                }
            });
        };

        comp.nextPageReuest = function (objectData, resolve, reject) {
            fetchTraktPage(object.url, objectData.page, function (json) {
                if (json && json.results && json.results.length) {
                    resolve(json);
                } else {
                    reject();
                }
            });
        };

        return comp;
    }

    function startPlugin() {
        if (window.plugin_trakt_multfilm_ready) return;
        window.plugin_trakt_multfilm_ready = true;

        Lampa.Component.add('trakt_multfilm_main', TraktAnimatedMoviesMain);
        Lampa.Component.add('trakt_multfilm_view', TraktAnimatedMoviesView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="trakt_multfilm"]').length) return;

            var btn = $(`<li class="menu__item selector" data-action="trakt_multfilm">
                <div class="menu__ico">${TRAKT_CONFIG.icon}</div>
                <div class="menu__text">${TRAKT_CONFIG.title}</div>
            </li>`);

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: TRAKT_CONFIG.title,
                    component: 'trakt_multfilm_main',
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

    if (!window.plugin_trakt_multfilm_ready) startPlugin();
})();
