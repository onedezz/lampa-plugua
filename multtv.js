(function () {
    'use strict';

    /**
     * ANIMATED TV SHOWS - TRAKT.TV ENGINE
     * Fixed Classics Pool (limit=150) & Reordered Categories (Decades before Genres)
     */

    var TRAKT_CLIENT_ID = '_vvIvZYJAxb7NikomG3qIfBcUCnMGwf1M7A-rqCLgCc';
    var EXCLUDED_LANGS = ['ru', 'be', 'ja', 'ko', 'zh'];
    var EXCLUDED_COUNTRIES = ['ru', 'by', 'jp', 'kr', 'cn'];

    var currentYear = new Date().getFullYear();
    var lastYear = currentYear - 1;
    var yearRangeOneYear = lastYear + '-' + currentYear;

    var TRAKT_CONFIG = {
        title: 'Мультсеріали',
        icon: '<svg viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/><path d="M9.5 7.5v7l5.5-3.5z" fill="#ffffff"/></svg>',
        categories: [
            // --- 1. ПОПУЛЯРНЕ ТА ТРЕНДИ ---
            { title: "⭐ Популярне", url: "https://api.trakt.tv/shows/popular?genres=animation&limit=60" },
            { title: "📈 Тренди", url: "https://api.trakt.tv/shows/trending?genres=animation&limit=60" },

            // --- 2. ДЕСЯТИЛІТТЯ (ЗА ПОПУЛЯРНІСТЮ) ---
            { title: "⚡ Сучасність 2020-х", url: "https://api.trakt.tv/shows/popular?genres=animation&years=2020-" + currentYear + "&limit=60" },
            { title: "💎 Ера 2010-х", url: "https://api.trakt.tv/shows/popular?genres=animation&years=2010-2019&limit=80" },
            { title: "💿 Культові 2000-ні", url: "https://api.trakt.tv/shows/popular?genres=animation&years=2000-2009&limit=80" },
            { title: "📼 1990-ті", url: "https://api.trakt.tv/shows/popular?genres=animation&years=1990-1999&limit=100" },
            { title: "🏛️ Класика (до 1990 року)", url: "https://api.trakt.tv/shows/popular?genres=animation&years=1900-1989&limit=150" },

            // --- 3. ЖАНРИ ЗА ОСТАННІЙ 1 РІК ---
            { title: "🤠 Пригоди та Екшн (За рік)", url: "https://api.trakt.tv/shows/popular?genres=animation,action,adventure&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🚀 Фантастика (За рік)", url: "https://api.trakt.tv/shows/popular?genres=animation,science-fiction&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🧙‍♂️ Фентезі (За рік)", url: "https://api.trakt.tv/shows/popular?genres=animation,fantasy&years=" + yearRangeOneYear + "&limit=60" },
            { title: "😂 Комедії (За рік)", url: "https://api.trakt.tv/shows/popular?genres=animation,comedy&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🎭 Драми та Душевні (За рік)", url: "https://api.trakt.tv/shows/popular?genres=animation,drama&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🔎 Детективи та Містика (За рік)", url: "https://api.trakt.tv/shows/popular?genres=animation,mystery&years=" + yearRangeOneYear + "&limit=60" },
            { title: "👨‍👩‍👧 Сімейні та Дитячі (За рік)", url: "https://api.trakt.tv/shows/popular?genres=animation,family&years=" + yearRangeOneYear + "&limit=60" }
        ]
    };

    function isUnwanted(show) {
        if (!show) return true;
        var lang = (show.language || '').toLowerCase();
        var country = (show.country || '').toLowerCase();

        if (EXCLUDED_LANGS.indexOf(lang) !== -1) return true;
        if (EXCLUDED_COUNTRIES.indexOf(country) !== -1) return true;
        return false;
    }

    // Підтягуємо дані з TMDB та жорстко перевіряємо наявність жанру "Animation" (ID 16)
    function enrichItemsWithTMDB(items, callback) {
        var network = new Lampa.Reguest();
        var lang = Lampa.Storage.get('language', 'uk');
        var enriched = [];
        var count = 0;

        if (!items || !items.length) return callback([]);

        items.forEach(function (traktItem, index) {
            var show = traktItem.show || traktItem;
            var tmdbId = show.ids ? show.ids.tmdb : null;

            if (!tmdbId || isUnwanted(show)) {
                count++;
                if (count === items.length) callback(enriched.filter(Boolean));
                return;
            }

            var tmdbUrl = Lampa.TMDB.api('tv/' + tmdbId + '?api_key=' + Lampa.TMDB.key() + '&language=' + lang);

            network.silent(tmdbUrl, function (tmdbData) {
                if (tmdbData && tmdbData.poster_path) {
                    var isAnimation = tmdbData.genres && tmdbData.genres.some(function (g) { return g.id === 16; });
                    var isAsianLang = EXCLUDED_LANGS.indexOf(tmdbData.original_language) !== -1;

                    if (isAnimation && !isAsianLang) {
                        enriched[index] = {
                            id: tmdbData.id,
                            name: tmdbData.name || show.title,
                            original_name: tmdbData.original_name || show.title,
                            overview: tmdbData.overview || show.overview || '',
                            poster_path: tmdbData.poster_path,
                            vote_average: tmdbData.vote_average || show.rating || 0,
                            first_air_date: tmdbData.first_air_date || show.first_air_date || '',
                            method: 'tv'
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

    function TraktAnimatedTvMain(object) {
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
                component: 'trakt_multtv_view',
                page: 1
            });
        };

        return comp;
    }

    function TraktAnimatedTvView(object) {
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
        if (window.plugin_trakt_multtv_ready) return;
        window.plugin_trakt_multtv_ready = true;

        Lampa.Component.add('trakt_multtv_main', TraktAnimatedTvMain);
        Lampa.Component.add('trakt_multtv_view', TraktAnimatedTvView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="trakt_multtv"]').length) return;

            var btn = $(`<li class="menu__item selector" data-action="trakt_multtv">
                <div class="menu__ico">${TRAKT_CONFIG.icon}</div>
                <div class="menu__text">${TRAKT_CONFIG.title}</div>
            </li>`);

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: TRAKT_CONFIG.title,
                    component: 'trakt_multtv_main',
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

    if (!window.plugin_trakt_multtv_ready) startPlugin();
})();
