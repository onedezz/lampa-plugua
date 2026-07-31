(function () {
    'use strict';

    /**
     * ULTIMATE GO - ALL-IN-ONE MEDIA ENGINE FOR LAMPA (TRENDING + WATCHED WEEKLY)
     */

    var TRAKT_CLIENT_ID = '_vvIvZYJAxb7NikomG3qIfBcUCnMGwf1M7A-rqCLgCc';

    var EXCLUDED_ALL_ASIAN_RU = ['ru', 'be', 'zh', 'cn', 'hi', 'in', 'ja', 'jp', 'ko', 'kr'];
    var ALLOWED_ASIAN = ['ja', 'ko'];

    var TRAKT_CONFIG = {
        title: 'UltimateGO',
        icon: '<svg viewBox="0 0 24 24" fill="#FF9800" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#ffffff" stroke-width="2" fill="none"/></svg>',
        categories: [
            // Фільми (Об'єднані Трендові + Переглянуті за тиждень)
            { id: "mov_mix", title: "🔥 Трендові та Масові Фільми", type: "movie", sub: "western" },
            // Серіали
            { id: "tv_mix", title: "📺 Трендові та Масові Серіали", type: "tv", sub: "western" },
            // Мультфільми
            { id: "cart_mov_mix", title: "🍿 Трендові та Масові Мультфільми", type: "movie", sub: "cartoons" },
            // Мультсеріали
            { id: "cart_tv_mix", title: "🎨 Трендові та Масові Мультсеріали", type: "tv", sub: "cartoons" },
            // Аніме (Серіали)
            { id: "anime_tv_mix", title: "⚔️ Трендові та Масові Аніме", type: "tv", sub: "anime" },
            // Аніме Фільми
            { id: "anime_mov_mix", title: "⛩️ Трендові та Масові Аніме Фільми", type: "movie", sub: "anime" },
            // Дорами Фільми
            { id: "dorama_mov_mix", title: "🎭 Трендові та Масові Дорами (Фільми)", type: "movie", sub: "dorama" },
            // Дорами Серіали
            { id: "dorama_tv_mix", title: "🌸 Трендові та Масові Дорами (Серіали)", type: "tv", sub: "dorama" },
            // Українські Фільми
            { id: "ua_mov", title: "🇺🇦 Українські Фільми (Топ та Новинки)", type: "movie", sub: "ua" },
            // Українські Серіали
            { id: "ua_tv", title: "🇺🇦 Українські Серіали (Топ та Новинки)", type: "tv", sub: "ua" }
        ]
    };

    function hasCJK(str) {
        return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\uac00-\ud7af]/.test(str || '');
    }

    function getCleanTitle(tmdbData, item, type, callback) {
        var tmdbTitle = type === 'movie' ? tmdbData.title : tmdbData.name;
        var traktTitle = item.title;

        if (tmdbTitle && !hasCJK(tmdbTitle)) return callback(tmdbTitle);
        if (traktTitle && !hasCJK(traktTitle)) return callback(traktTitle);

        var enUrl = Lampa.TMDB.api(type + '/' + tmdbData.id + '?api_key=' + Lampa.TMDB.key() + '&language=en');
        var net = new Lampa.Reguest();
        net.silent(enUrl, function (enData) {
            var enTitle = type === 'movie' ? (enData ? enData.title : '') : (enData ? enData.name : '');
            if (enTitle && !hasCJK(enTitle)) {
                callback(enTitle);
            } else {
                callback(traktTitle || tmdbTitle || '');
            }
        }, function () {
            callback(traktTitle || tmdbTitle || '');
        });
    }

    // Завантаження українського контенту з TMDB
    function fetchUACategory(cat, page, limit, callback) {
        var network = new Lampa.Reguest();
        var lang = Lampa.Storage.get('language', 'uk');
        var tmdbUrl = Lampa.TMDB.api('discover/' + cat.type + '?api_key=' + Lampa.TMDB.key() + '&with_origin_country=UA&sort_by=popularity.desc&page=' + page + '&language=' + lang);

        network.silent(tmdbUrl, function (data) {
            var results = (data && data.results) ? data.results : [];
            var formatted = [];
            var count = 0;

            if (!results.length) return callback({ results: [], page: page, total_pages: 1 });

            results.forEach(function (item, index) {
                if (!item.poster_path) {
                    count++;
                    if (count === results.length) callback({ results: formatted.filter(Boolean), page: page, total_pages: data.total_pages || 1 });
                    return;
                }

                getCleanTitle(item, item, cat.type, function (cleanTitle) {
                    formatted[index] = {
                        id: item.id,
                        title: cat.type === 'movie' ? cleanTitle : undefined,
                        name: cat.type === 'tv' ? cleanTitle : undefined,
                        original_title: cat.type === 'movie' ? item.original_title : undefined,
                        original_name: cat.type === 'tv' ? item.original_name : undefined,
                        overview: item.overview || '',
                        poster_path: item.poster_path,
                        vote_average: item.vote_average || 0,
                        release_date: item.release_date || '',
                        first_air_date: item.first_air_date || '',
                        method: cat.type
                    };
                    count++;
                    if (count === results.length) callback({ results: formatted.filter(Boolean), page: page, total_pages: data.total_pages || 1 });
                });
            });
        }, function () {
            callback({ results: [], page: page, total_pages: 1 });
        });
    }

    function enrichItemsWithTMDB(items, type, subType, callback) {
        var network = new Lampa.Reguest();
        var lang = Lampa.Storage.get('language', 'uk');
        var enriched = [];
        var count = 0;

        if (!items || !items.length) return callback([]);

        items.forEach(function (traktItem, index) {
            var media = traktItem.movie || traktItem.show || traktItem;
            var tmdbId = media.ids ? media.ids.tmdb : null;

            if (!tmdbId) {
                count++;
                if (count === items.length) callback(enriched.filter(Boolean));
                return;
            }

            var tmdbUrl = Lampa.TMDB.api(type + '/' + tmdbId + '?api_key=' + Lampa.TMDB.key() + '&language=' + lang);

            network.silent(tmdbUrl, function (tmdbData) {
                if (tmdbData && tmdbData.poster_path) {
                    var isAnim = tmdbData.genres && tmdbData.genres.some(function (g) { return g.id === 16; });
                    var origLang = (tmdbData.original_language || media.language || '').toLowerCase();
                    var origCountry = (media.country || '').toLowerCase();
                    var passFilter = false;

                    if (subType === 'western') {
                        if (!isAnim && EXCLUDED_ALL_ASIAN_RU.indexOf(origLang) === -1 && EXCLUDED_ALL_ASIAN_RU.indexOf(origCountry) === -1) passFilter = true;
                    } else if (subType === 'cartoons') {
                        if (isAnim && EXCLUDED_ALL_ASIAN_RU.indexOf(origLang) === -1 && EXCLUDED_ALL_ASIAN_RU.indexOf(origCountry) === -1) passFilter = true;
                    } else if (subType === 'anime') {
                        if (isAnim && ALLOWED_ASIAN.indexOf(origLang) !== -1) passFilter = true;
                    } else if (subType === 'dorama') {
                        if (!isAnim && ALLOWED_ASIAN.indexOf(origLang) !== -1) passFilter = true;
                    }

                    if (passFilter) {
                        getCleanTitle(tmdbData, media, type, function (cleanTitle) {
                            enriched[index] = {
                                id: tmdbData.id,
                                title: type === 'movie' ? cleanTitle : undefined,
                                name: type === 'tv' ? cleanTitle : undefined,
                                original_title: type === 'movie' ? (media.title || tmdbData.original_title) : undefined,
                                original_name: type === 'tv' ? (media.title || tmdbData.original_name) : undefined,
                                overview: tmdbData.overview || media.overview || '',
                                poster_path: tmdbData.poster_path,
                                vote_average: tmdbData.vote_average || media.rating || 0,
                                release_date: tmdbData.release_date || media.released || '',
                                first_air_date: tmdbData.first_air_date || media.first_air_date || '',
                                method: type
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

    // Злиття Trending + Watched (Weekly) без повторів
    function fetchCombinedCategory(cat, page, limit, callback) {
        if (cat.sub === 'ua') {
            fetchUACategory(cat, page, limit, callback);
            return;
        }

        var endpoint = cat.type === 'movie' ? 'movies' : 'shows';
        var trendingUrl = 'https://api.trakt.tv/' + endpoint + '/trending?page=' + page + '&limit=' + limit;
        var watchedUrl = 'https://api.trakt.tv/' + endpoint + '/watched/weekly?page=' + page + '&limit=' + limit;

        if (cat.sub === 'cartoons') {
            trendingUrl += '&genres=animation';
            watchedUrl += '&genres=animation';
        } else if (cat.sub === 'anime') {
            trendingUrl += '&genres=anime';
            watchedUrl += '&genres=anime';
        }
        if (cat.sub === 'dorama') {
            trendingUrl += '&countries=jp,kr';
            watchedUrl += '&countries=jp,kr';
        }

        var headers = {
            'Content-Type': 'application/json',
            'trakt-api-version': '2',
            'trakt-api-key': TRAKT_CLIENT_ID
        };

        $.when(
            $.ajax({ url: trendingUrl, type: 'GET', headers: headers }),
            $.ajax({ url: watchedUrl, type: 'GET', headers: headers })
        ).done(function (resTrending, resWatched) {
            var listTrending = (resTrending && resTrending[0]) ? resTrending[0] : [];
            var listWatched = (resWatched && resWatched[0]) ? resWatched[0] : [];

            var combinedRaw = [];
            var seenIds = {};
            var maxLen = Math.max(listTrending.length, listWatched.length);

            for (var i = 0; i < maxLen; i++) {
                if (listTrending[i]) {
                    var itemT = listTrending[i].movie || listTrending[i].show || listTrending[i];
                    var idT = itemT.ids ? itemT.ids.trakt : null;
                    if (idT && !seenIds[idT]) {
                        seenIds[idT] = true;
                        combinedRaw.push(listTrending[i]);
                    }
                }
                if (listWatched[i]) {
                    var itemW = listWatched[i].movie || listWatched[i].show || listWatched[i];
                    var idW = itemW.ids ? itemW.ids.trakt : null;
                    if (idW && !seenIds[idW]) {
                        seenIds[idW] = true;
                        combinedRaw.push(listWatched[i]);
                    }
                }
            }

            enrichItemsWithTMDB(combinedRaw, cat.type, cat.sub, function (formattedResults) {
                callback({
                    results: formattedResults,
                    page: page,
                    total_pages: 50
                });
            });
        }).fail(function () {
            callback(null);
        });
    }

    function UltimateGoMain(object) {
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
                        var displayResults = data.results.slice(0, 20);
                        Lampa.Utils.extendItemsParams(displayResults, { style: { name: 'wide' } });
                        
                        fulldata.push({
                            title: cat.title,
                            results: displayResults,
                            catObject: cat,
                            more: true
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
                fetchCombinedCategory(cat, 1, 40, function (data) {
                    if (data && data.results) status.append(index.toString(), data);
                    else status.error();
                });
            });

            return this.render();
        };

        comp.onMore = function (data) {
            Lampa.Activity.push({
                catObject: data.catObject,
                title: data.title,
                component: 'ultimatego_view',
                page: 1
            });
        };

        return comp;
    }

    function UltimateGoView(object) {
        var comp = new Lampa.InteractionCategory(object);

        comp.create = function () {
            var _this = this;
            fetchCombinedCategory(object.catObject, 1, 60, function (json) {
                json && json.results && json.results.length ? _this.build(json) : _this.empty();
            });
        };

        comp.nextPageReuest = function (objectData, resolve, reject) {
            fetchCombinedCategory(object.catObject, objectData.page, 60, function (json) {
                json && json.results && json.results.length ? resolve(json) : reject();
            });
        };

        return comp;
    }

    function startPlugin() {
        if (window.plugin_ultimatego_ready) return;
        window.plugin_ultimatego_ready = true;

        Lampa.Component.add('ultimatego_main', UltimateGoMain);
        Lampa.Component.add('ultimatego_view', UltimateGoView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="ultimatego"]').length) return;

            var btn = $(`<li class="menu__item selector" data-action="ultimatego">
                <div class="menu__ico">${TRAKT_CONFIG.icon}</div>
                <div class="menu__text">${TRAKT_CONFIG.title}</div>
            </li>`);

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: TRAKT_CONFIG.title,
                    component: 'ultimatego_main',
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

    if (!window.plugin_ultimatego_ready) startPlugin();
})();
