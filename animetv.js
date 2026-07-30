(function () {
    'use strict';

    /**
     * ANIME TV SERIES - TRAKT.TV ENGINE
     * Single Pure Genres (No Combinations), Expanded Categories & TMDB Localization
     */

    var TRAKT_CLIENT_ID = '_vvIvZYJAxb7NikomG3qIfBcUCnMGwf1M7A-rqCLgCc';
    var ALLOWED_LANGS = ['ja', 'ko'];
    var ALLOWED_COUNTRIES = ['jp', 'kr'];

    var currentYear = new Date().getFullYear();
    var lastYear = currentYear - 1;
    var yearRangeOneYear = lastYear + '-' + currentYear;

    var TRAKT_CONFIG = {
        title: 'Аніме серіали',
        icon: '<svg viewBox="0 0 24 24" fill="#E91E63" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/><path d="M9.5 7.5v7l5.5-3.5z" fill="#ffffff"/></svg>',
        categories: [
            // --- 1. ПОПУЛЯРНЕ ТА ТРЕНДИ ---
            { title: "⭐ Популярне аніме", url: "https://api.trakt.tv/shows/popular?genres=anime&countries=jp,kr&limit=60" },
            { title: "📈 Тренди", url: "https://api.trakt.tv/shows/trending?genres=anime&countries=jp,kr&limit=60" },

            // --- 2. ДЕСЯТИЛІТТЯ (ЗА ПОПУЛЯРНІСТЮ) ---
            { title: "⚡ Сучасність 2020-х", url: "https://api.trakt.tv/shows/popular?genres=anime&countries=jp,kr&years=2020-" + currentYear + "&limit=60" },
            { title: "💎 Ера 2010-х", url: "https://api.trakt.tv/shows/popular?genres=anime&countries=jp,kr&years=2010-2019&limit=80" },
            { title: "💿 Культові 2000-ні", url: "https://api.trakt.tv/shows/popular?genres=anime&countries=jp,kr&years=2000-2009&limit=80" },
            { title: "📼 1990-ті", url: "https://api.trakt.tv/shows/popular?genres=anime&countries=jp,kr&years=1990-1999&limit=100" },
            { title: "🏛️ Класика (до 1990 року)", url: "https://api.trakt.tv/shows/popular?genres=anime&countries=jp,kr&years=1900-1989&limit=150" },

            // --- 3. ОКРЕМІ ЖАНРИ (ЗА ОСТАННІЙ 1 РІК) ---
            { title: "⚔️ Бойовики (За рік)", url: "https://api.trakt.tv/shows/popular?genres=anime,action&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🤠 Пригоди (За рік)", url: "https://api.trakt.tv/shows/popular?genres=anime,adventure&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🚀 Фантастика (За рік)", url: "https://api.trakt.tv/shows/popular?genres=anime,science-fiction&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🧙‍♂️ Фентезі (За рік)", url: "https://api.trakt.tv/shows/popular?genres=anime,fantasy&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🔪 Трилери (За рік)", url: "https://api.trakt.tv/shows/popular?genres=anime,thriller&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🔎 Детективи (За рік)", url: "https://api.trakt.tv/shows/popular?genres=anime,mystery&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "😱 Жахи (За рік)", url: "https://api.trakt.tv/shows/popular?genres=anime,horror&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "😂 Комедії (За рік)", url: "https://api.trakt.tv/shows/popular?genres=anime,comedy&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🎭 Драми (За рік)", url: "https://api.trakt.tv/shows/popular?genres=anime,drama&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "💖 Романтика (За рік)", url: "https://api.trakt.tv/shows/popular?genres=anime,romance&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🚨 Кримінал (За рік)", url: "https://api.trakt.tv/shows/popular?genres=anime,crime&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🎼 Музичні (За рік)", url: "https://api.trakt.tv/shows/popular?genres=anime,music&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "⚔️ Військові (За рік)", url: "https://api.trakt.tv/shows/popular?genres=anime,war&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "👨‍👩‍👧 Сімейні (За рік)", url: "https://api.trakt.tv/shows/popular?genres=anime,family&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" }
        ]
    };

    function isAllowedAnime(show) {
        if (!show) return false;
        var lang = (show.language || '').toLowerCase();
        var country = (show.country || '').toLowerCase();

        var langOk = !lang || ALLOWED_LANGS.indexOf(lang) !== -1;
        var countryOk = !country || ALLOWED_COUNTRIES.indexOf(country) !== -1;

        return langOk && countryOk;
    }

    function enrichItemsWithTMDB(items, callback) {
        var network = new Lampa.Reguest();
        var lang = Lampa.Storage.get('language', 'uk');
        var enriched = [];
        var count = 0;

        if (!items || !items.length) return callback([]);

        items.forEach(function (traktItem, index) {
            var show = traktItem.show || traktItem;
            var tmdbId = show.ids ? show.ids.tmdb : null;

            if (!tmdbId || !isAllowedAnime(show)) {
                count++;
                if (count === items.length) callback(enriched.filter(Boolean));
                return;
            }

            var tmdbUrl = Lampa.TMDB.api('tv/' + tmdbId + '?api_key=' + Lampa.TMDB.key() + '&language=' + lang);

            network.silent(tmdbUrl, function (tmdbData) {
                if (tmdbData && tmdbData.poster_path) {
                    var origLang = (tmdbData.original_language || '').toLowerCase();
                    var isAsianOrigin = ALLOWED_LANGS.indexOf(origLang) !== -1;

                    if (isAsianOrigin) {
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

    function TraktAnimeTvMain(object) {
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
                component: 'trakt_animetv_view',
                page: 1
            });
        };

        return comp;
    }

    function TraktAnimeTvView(object) {
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
        if (window.plugin_trakt_animetv_ready) return;
        window.plugin_trakt_animetv_ready = true;

        Lampa.Component.add('trakt_animetv_main', TraktAnimeTvMain);
        Lampa.Component.add('trakt_animetv_view', TraktAnimeTvView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="trakt_animetv"]').length) return;

            var btn = $(`<li class="menu__item selector" data-action="trakt_animetv">
                <div class="menu__ico">${TRAKT_CONFIG.icon}</div>
                <div class="menu__text">${TRAKT_CONFIG.title}</div>
            </li>`);

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: TRAKT_CONFIG.title,
                    component: 'trakt_animetv_main',
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

    if (!window.plugin_trakt_animetv_ready) startPlugin();
})();
