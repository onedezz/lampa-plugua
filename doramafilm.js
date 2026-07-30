(function () {
    'use strict';

    /**
     * ASIAN LIVE-ACTION MOVIES (DORAMA FILMS) - TRAKT.TV ENGINE
     * Japanese & South Korean Feature Live-Action Films (Excludes Animation & TV Shows)
     */

    var TRAKT_CLIENT_ID = '_vvIvZYJAxb7NikomG3qIfBcUCnMGwf1M7A-rqCLgCc';
    var ALLOWED_LANGS = ['ja', 'ko'];
    var ALLOWED_COUNTRIES = ['jp', 'kr'];

    var currentYear = new Date().getFullYear();
    var lastYear = currentYear - 1;
    var yearRangeOneYear = lastYear + '-' + currentYear;

    var TRAKT_CONFIG = {
        title: 'Дорами Фільми',
        icon: '<svg viewBox="0 0 24 24" fill="#9C27B0" xmlns="http://www.w3.org/2000/svg"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H9l2 4H8L6 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>',
        categories: [
            // --- 1. ПОПУЛЯРНЕ ТА ТРЕНДИ ---
            { title: "⭐ Популярні дорами (фільми)", url: "https://api.trakt.tv/movies/popular?countries=jp,kr&limit=60" },
            { title: "📈 Тренди", url: "https://api.trakt.tv/movies/trending?countries=jp,kr&limit=60" },

            // --- 2. ДЕСЯТИЛІТТЯ (ЗА ПОПУЛЯРНІСТЮ) ---
            { title: "⚡ Сучасність 2020-х", url: "https://api.trakt.tv/movies/popular?countries=jp,kr&years=2020-" + currentYear + "&limit=60" },
            { title: "💎 Ера 2010-х", url: "https://api.trakt.tv/movies/popular?countries=jp,kr&years=2010-2019&limit=80" },
            { title: "💿 Культові 2000-ні", url: "https://api.trakt.tv/movies/popular?countries=jp,kr&years=2000-2009&limit=80" },
            { title: "📼 1990-ті", url: "https://api.trakt.tv/movies/popular?countries=jp,kr&years=1990-1999&limit=100" },
            { title: "🏛️ Класика (до 1990 року)", url: "https://api.trakt.tv/movies/popular?countries=jp,kr&years=1900-1989&limit=150" },

            // --- 3. ОКРЕМІ ЖАНРИ (ЗА ОСТАННІЙ 1 РІК) ---
            { title: "⚔️ Бойовики (За рік)", url: "https://api.trakt.tv/movies/popular?genres=action&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🤠 Пригоди (За рік)", url: "https://api.trakt.tv/movies/popular?genres=adventure&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🚀 Фантастика (За рік)", url: "https://api.trakt.tv/movies/popular?genres=science-fiction&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🧙‍♂️ Фентезі (За рік)", url: "https://api.trakt.tv/movies/popular?genres=fantasy&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🔪 Трилери (За рік)", url: "https://api.trakt.tv/movies/popular?genres=thriller&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🔎 Детективи (За рік)", url: "https://api.trakt.tv/movies/popular?genres=mystery&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "😱 Жахи (За рік)", url: "https://api.trakt.tv/movies/popular?genres=horror&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "😂 Комедії (За рік)", url: "https://api.trakt.tv/movies/popular?genres=comedy&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🎭 Драми (За рік)", url: "https://api.trakt.tv/movies/popular?genres=drama&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "💖 Романтика (За рік)", url: "https://api.trakt.tv/movies/popular?genres=romance&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🚨 Кримінал (За рік)", url: "https://api.trakt.tv/movies/popular?genres=crime&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "🎼 Музичні (За рік)", url: "https://api.trakt.tv/movies/popular?genres=music&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "⚔️ Військові (За рік)", url: "https://api.trakt.tv/movies/popular?genres=war&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" },
            { title: "👨‍👩‍👧 Сімейні (За рік)", url: "https://api.trakt.tv/movies/popular?genres=family&countries=jp,kr&years=" + yearRangeOneYear + "&limit=60" }
        ]
    };

    function hasCJK(str) {
        return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\uac00-\ud7af]/.test(str || '');
    }

    function isAllowedDorama(movie) {
        if (!movie) return false;
        var lang = (movie.language || '').toLowerCase();
        var country = (movie.country || '').toLowerCase();

        var langOk = !lang || ALLOWED_LANGS.indexOf(lang) !== -1;
        var countryOk = !country || ALLOWED_COUNTRIES.indexOf(country) !== -1;

        return langOk && countryOk;
    }

    function getCleanTitle(tmdbData, movie, callback) {
        var titleUk = tmdbData.title;
        
        if (titleUk && !hasCJK(titleUk)) {
            return callback(titleUk);
        }

        if (movie.title && !hasCJK(movie.title)) {
            return callback(movie.title);
        }

        var enUrl = Lampa.TMDB.api('movie/' + tmdbData.id + '?api_key=' + Lampa.TMDB.key() + '&language=en');
        var net = new Lampa.Reguest();
        net.silent(enUrl, function (enData) {
            if (enData && enData.title && !hasCJK(enData.title)) {
                callback(enData.title);
            } else {
                callback(movie.title || tmdbData.original_title || tmdbData.title || '');
            }
        }, function () {
            callback(movie.title || tmdbData.title || '');
        });
    }

    function enrichItemsWithTMDB(items, callback) {
        var network = new Lampa.Reguest();
        var lang = Lampa.Storage.get('language', 'uk');
        var enriched = [];
        var count = 0;

        if (!items || !items.length) return callback([]);

        items.forEach(function (traktItem, index) {
            var movie = traktItem.movie || traktItem;
            var tmdbId = movie.ids ? movie.ids.tmdb : null;

            if (!tmdbId || !isAllowedDorama(movie)) {
                count++;
                if (count === items.length) callback(enriched.filter(Boolean));
                return;
            }

            var tmdbUrl = Lampa.TMDB.api('movie/' + tmdbId + '?api_key=' + Lampa.TMDB.key() + '&language=' + lang);

            network.silent(tmdbUrl, function (tmdbData) {
                if (tmdbData && tmdbData.poster_path) {
                    // Перевіряємо, що це НЕ анімація (ID 16 відсутній)
                    var isAnimation = tmdbData.genres && tmdbData.genres.some(function (g) { return g.id === 16; });
                    var origLang = (tmdbData.original_language || '').toLowerCase();
                    var isAsianOrigin = ALLOWED_LANGS.indexOf(origLang) !== -1;

                    if (!isAnimation && isAsianOrigin) {
                        getCleanTitle(tmdbData, movie, function (cleanTitle) {
                            enriched[index] = {
                                id: tmdbData.id,
                                title: cleanTitle,
                                original_title: movie.title || tmdbData.original_title || '',
                                overview: tmdbData.overview || movie.overview || '',
                                poster_path: tmdbData.poster_path,
                                vote_average: tmdbData.vote_average || movie.rating || 0,
                                release_date: tmdbData.release_date || movie.released || '',
                                method: 'movie'
                            };
                            count++;
                            if (count === items.length) callback(enriched.filter(Boolean));
                        });
                        return;
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

    function TraktDoramaMoviesMain(object) {
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
                component: 'trakt_doramafilm_view',
                page: 1
            });
        };

        return comp;
    }

    function TraktDoramaMoviesView(object) {
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
        if (window.plugin_trakt_doramafilm_ready) return;
        window.plugin_trakt_doramafilm_ready = true;

        Lampa.Component.add('trakt_doramafilm_main', TraktDoramaMoviesMain);
        Lampa.Component.add('trakt_doramafilm_view', TraktDoramaMoviesView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="trakt_doramafilm"]').length) return;

            var btn = $(`<li class="menu__item selector" data-action="trakt_doramafilm">
                <div class="menu__ico">${TRAKT_CONFIG.icon}</div>
                <div class="menu__text">${TRAKT_CONFIG.title}</div>
            </li>`);

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: TRAKT_CONFIG.title,
                    component: 'trakt_doramafilm_main',
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

    if (!window.plugin_trakt_doramafilm_ready) startPlugin();
})();
