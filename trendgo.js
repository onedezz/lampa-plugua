(function () {
    'use strict';

    /**
     * ULTIMATE GO - ALL-IN-ONE MEDIA ENGINE FOR LAMPA (SIMKL API INTEGRATION)
     */

    var SIMKL_CLIENT_ID = 'YOUR_SIMKL_CLIENT_ID'; 

    var EXCLUDED_ALL_ASIAN_RU = ['ru', 'be', 'zh', 'cn', 'hi', 'in', 'ja', 'jp', 'ko', 'kr'];
    var ALLOWED_ASIAN = ['ja', 'ko'];

    var CONFIG = {
        title: 'UltimateGO',
        icon: '<svg viewBox="0 0 24 24" fill="#FF9800" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#ffffff" stroke-width="2" fill="none"/></svg>',
        categories: [
            // Фільми
            { id: "mov_pop", title: "🔥 Популярні Фільми", type: "movie", sub: "western", endpoint: "movies/popular" },
            { id: "mov_trd", title: "📈 Трендові Фільми", type: "movie", sub: "western", endpoint: "movies/trending" },
            // Серіали
            { id: "tv_pop", title: "📺 Популярні Серіали", type: "tv", sub: "western", endpoint: "tv/popular" },
            { id: "tv_trd", title: "📉 Трендові Серіали", type: "tv", sub: "tv", endpoint: "tv/trending" },
            // Мультфільми
            { id: "cart_mov_pop", title: "🍿 Популярні Мультфільми", type: "movie", sub: "cartoons", endpoint: "movies/genres/animation/popular" },
            { id: "cart_mov_trd", title: "🚀 Трендові Мультфільми", type: "movie", sub: "cartoons", endpoint: "movies/genres/animation/trending" },
            // Мультсеріали
            { id: "cart_tv_pop", title: "🎨 Популярні Мультсеріали", type: "tv", sub: "cartoons", endpoint: "tv/genres/animation/popular" },
            { id: "cart_tv_trd", title: "⚡ Трендові Мультсеріали", type: "tv", sub: "cartoons", endpoint: "tv/genres/animation/trending" },
            // Аніме (Серіали)
            { id: "anime_tv_pop", title: "⚔️ Популярні Аніме", type: "tv", sub: "anime", endpoint: "anime/popular" },
            { id: "anime_tv_trd", title: "💥 Трендові Аніме", type: "tv", sub: "anime", endpoint: "anime/trending" },
            // Аніме Фільми
            { id: "anime_mov_pop", title: "⛩️ Популярні Аніме Фільми", type: "movie", sub: "anime", endpoint: "anime/movies/popular" },
            { id: "anime_mov_trd", title: "🌟 Трендові Аніме Фільми", type: "movie", sub: "anime", endpoint: "anime/movies/trending" },
            // Дорами Фільми
            { id: "dorama_mov_pop", title: "🎭 Популярні Дорами (Фільми)", type: "movie", sub: "dorama", endpoint: "movies/genres/asian/popular" },
            { id: "dorama_mov_trd", title: "🎬 Трендові Дорами (Фільми)", type: "movie", sub: "dorama", endpoint: "movies/genres/asian/trending" },
            // Дорами Серіали
            { id: "dorama_tv_pop", title: "🌸 Популярні Дорами (Серіали)", type: "tv", sub: "dorama", endpoint: "tv/genres/asian/popular" },
            { id: "dorama_tv_trd", title: "🌿 Трендові Дорами (Серіали)", type: "tv", sub: "dorama", endpoint: "tv/genres/asian/trending" }
        ]
    };

    function hasCJK(str) {
        return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\uac00-\ud7af]/.test(str || '');
    }

    function getCleanTitle(tmdbData, item, type, callback) {
        var tmdbTitle = type === 'movie' ? tmdbData.title : tmdbData.name;
        var simklTitle = item.title;

        if (tmdbTitle && !hasCJK(tmdbTitle)) return callback(tmdbTitle);
        if (simklTitle && !hasCJK(simklTitle)) return callback(simklTitle);

        var enUrl = Lampa.TMDB.api(type + '/' + tmdbData.id + '?api_key=' + Lampa.TMDB.key() + '&language=en');
        var net = new Lampa.Reguest();
        net.silent(enUrl, function (enData) {
            var enTitle = type === 'movie' ? (enData ? enData.title : '') : (enData ? enData.name : '');
            if (enTitle && !hasCJK(enTitle)) {
                callback(enTitle);
            } else {
                callback(simklTitle || tmdbTitle || '');
            }
        }, function () {
            callback(simklTitle || tmdbTitle || '');
        });
    }

    function enrichItemsWithTMDB(items, type, subType, callback) {
        var network = new Lampa.Reguest();
        var lang = Lampa.Storage.get('language', 'uk');
        var enriched = [];
        var count = 0;

        if (!items || !items.length) return callback([]);

        items.forEach(function (rawItem, index) {
            var simklItem = rawItem.movie || rawItem.show || rawItem.anime || rawItem;
            var tmdbId = (simklItem.ids && simklItem.ids.tmdb) ? simklItem.ids.tmdb : null;

            if (!tmdbId) {
                count++;
                if (count === items.length) callback(enriched.filter(Boolean));
                return;
            }

            var origLang = (simklItem.language || '').toLowerCase();
            var origCountry = (simklItem.country || '').toLowerCase();
            var passFilter = true;

            // Фільтрація мов/країн тільки де це строго необхідно
            if (subType === 'western') {
                if (EXCLUDED_ALL_ASIAN_RU.indexOf(origLang) !== -1 || EXCLUDED_ALL_ASIAN_RU.indexOf(origCountry) !== -1) {
                    passFilter = false;
                }
            }

            if (!passFilter) {
                count++;
                if (count === items.length) callback(enriched.filter(Boolean));
                return;
            }

            var tmdbUrl = Lampa.TMDB.api(type + '/' + tmdbId + '?api_key=' + Lampa.TMDB.key() + '&language=' + lang);

            network.silent(tmdbUrl, function (tmdbData) {
                var poster = (tmdbData && tmdbData.poster_path) ? tmdbData.poster_path : (simklItem.poster ? 'https://simkl.in/posters/' + simklItem.poster + '_m.jpg' : '');
                
                if (tmdbData || poster) {
                    getCleanTitle(tmdbData || {}, simklItem, type, function (cleanTitle) {
                        enriched[index] = {
                            id: tmdbData ? tmdbData.id : tmdbId,
                            title: type === 'movie' ? cleanTitle : undefined,
                            name: type === 'tv' ? cleanTitle : undefined,
                            original_title: type === 'movie' ? (simklItem.title || (tmdbData ? tmdbData.original_title : '')) : undefined,
                            original_name: type === 'tv' ? (simklItem.title || (tmdbData ? tmdbData.original_name : '')) : undefined,
                            overview: (tmdbData && tmdbData.overview) ? tmdbData.overview : (simklItem.overview || ''),
                            poster_path: tmdbData ? tmdbData.poster_path : null,
                            img: poster,
                            vote_average: (tmdbData && tmdbData.vote_average) ? tmdbData.vote_average : (simklItem.users_rating || 0),
                            release_date: (tmdbData && tmdbData.release_date) ? tmdbData.release_date : (simklItem.year ? simklItem.year.toString() : ''),
                            first_air_date: (tmdbData && tmdbData.first_air_date) ? tmdbData.first_air_date : (simklItem.year ? simklItem.year.toString() : ''),
                            method: type
                        };
                        count++;
                        if (count === items.length) callback(enriched.filter(Boolean));
                    });
                } else {
                    count++;
                    if (count === items.length) callback(enriched.filter(Boolean));
                }
            }, function () {
                count++;
                if (count === items.length) callback(enriched.filter(Boolean));
            });
        });
    }

    function fetchCategory(cat, page, limit, callback) {
        var url = 'https://api.simkl.com/' + cat.endpoint + '?extended=full&limit=' + limit + '&page=' + page;
        url += '&client_id=' + SIMKL_CLIENT_ID + '&app-name=LampaApp&app-version=1.0';

        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'LampaMediaServer/1.0'
            },
            success: function (response) {
                var rawList = Array.isArray(response) ? response : [];
                enrichItemsWithTMDB(rawList, cat.type, cat.sub, function (formattedResults) {
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

    function UltimateGoMain(object) {
        var comp = new Lampa.InteractionMain(object);

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var categories = CONFIG.categories;
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
                fetchCategory(cat, 1, 40, function (data) {
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
            fetchCategory(object.catObject, 1, 60, function (json) {
                if (json && json.results && json.results.length) {
                    _this.build(json);
                } else {
                    _this.empty();
                }
            });
        };

        comp.nextPageReuest = function (objectData, resolve, reject) {
            fetchCategory(object.catObject, objectData.page, 60, function (json) {
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
        if (window.plugin_ultimatego_ready) return;
        window.plugin_ultimatego_ready = true;

        Lampa.Component.add('ultimatego_main', UltimateGoMain);
        Lampa.Component.add('ultimatego_view', UltimateGoView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="ultimatego"]').length) return;

            var btn = $(`<li class="menu__item selector" data-action="ultimatego">
                <div class="menu__ico">${CONFIG.icon}</div>
                <div class="menu__text">${CONFIG.title}</div>
            </li>`);

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: CONFIG.title,
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
