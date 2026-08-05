(function () {
    'use strict';

    /**
     * ULTIMATE GO - SIMKL MEDIA ENGINE FOR LAMPA
     * Категорії: Фільми, Серіали, Аніме, Дорами (Популярне та Тренди)
     */

    // 🔑 Вкажіть ваш Client ID від Simkl
    var SIMKL_CLIENT_ID = '28411c2510ddc138f76bc3e1022981f88e4402ad1b9e9e11e5d379667360bfdf';

    var CONFIG = {
        title: 'UltimateGO',
        icon: '<svg viewBox="0 0 24 24" fill="#FF9800" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#ffffff" stroke-width="2" fill="none"/></svg>',
        categories: [
            // 🎬 ФІЛЬМИ
            { id: "mov_pop", title: "🔥 Популярні Фільми", type: "movie", endpoint: "movies/popular" },
            { id: "mov_trd", title: "📈 Трендові Фільми", type: "movie", endpoint: "movies/trending" },

            // 📺 СЕРІАЛИ
            { id: "tv_pop", title: "📺 Популярні Серіали", type: "tv", endpoint: "tv/popular" },
            { id: "tv_trd", title: "📉 Трендові Серіали", type: "tv", endpoint: "tv/trending" },

            // ⚔️ АНІМЕ
            { id: "anime_tv_pop", title: "⚔️ Популярне Аніме (Серіали)", type: "tv", endpoint: "anime/popular" },
            { id: "anime_tv_trd", title: "💥 Трендове Аніме (Серіали)", type: "tv", endpoint: "anime/trending" },
            { id: "anime_mov_pop", title: "⛩️ Популярне Аніме (Фільми)", type: "movie", endpoint: "anime/movies/popular" },
            { id: "anime_mov_trd", title: "🌟 Трендове Аніме (Фільми)", type: "movie", endpoint: "anime/movies/trending" },

            // 🌸 ДОРАМИ
            { id: "dorama_tv_pop", title: "🌸 Популярні Дорами (Серіали)", type: "tv", endpoint: "tv/genres/asian/popular" },
            { id: "dorama_tv_trd", title: "🌿 Трендові Дорами (Серіали)", type: "tv", endpoint: "tv/genres/asian/trending" },
            { id: "dorama_mov_pop", title: "🎭 Популярні Дорами (Фільми)", type: "movie", endpoint: "movies/genres/asian/popular" },
            { id: "dorama_mov_trd", title: "🎬 Трендові Дорами (Фільми)", type: "movie", endpoint: "movies/genres/asian/trending" }
        ]
    };

    /**
     * Запит списку контенту з Simkl API
     */
    function fetchCategoryData(cat, page, limit, callback) {
        var url = 'https://api.simkl.com/' + cat.endpoint + '?extended=full&limit=' + limit + '&page=' + page + '&client_id=' + SIMKL_CLIENT_ID;

        var network = new Lampa.Reguest();
        network.silent(url, function (response) {
            var rawList = Array.isArray(response) ? response : [];
            formatSimklItems(rawList, cat.type, function (items) {
                callback({
                    results: items,
                    page: page,
                    total_pages: 50
                });
            });
        }, function () {
            callback(null);
        });
    }

    /**
     * Конвертація об'єктів Simkl та синхронізація з TMDB
     */
    function formatSimklItems(rawList, defaultType, callback) {
        if (!rawList || !rawList.length) return callback([]);

        var lang = Lampa.Storage.get('language', 'uk');
        var network = new Lampa.Reguest();
        var results = [];
        var count = 0;

        rawList.forEach(function (raw, index) {
            var item = raw.movie || raw.show || raw.anime || raw;
            var tmdbId = (item.ids && item.ids.tmdb) ? item.ids.tmdb : null;
            var itemType = defaultType;

            var finish = function (formatted) {
                if (formatted) results[index] = formatted;
                count++;
                if (count === rawList.length) {
                    callback(results.filter(Boolean));
                }
            };

            var simklPoster = item.poster ? ('https://simkl.in/posters/' + item.poster + '_m.jpg') : '';

            if (tmdbId) {
                var tmdbUrl = Lampa.TMDB.api(itemType + '/' + tmdbId + '?api_key=' + Lampa.TMDB.key() + '&language=' + lang);
                network.silent(tmdbUrl, function (tmdb) {
                    var title = itemType === 'movie' ? (tmdb ? tmdb.title : item.title) : (tmdb ? tmdb.name : item.title);
                    var originalTitle = itemType === 'movie' ? (tmdb ? tmdb.original_title : item.title) : (tmdb ? tmdb.original_name : item.title);

                    finish({
                        id: tmdb ? tmdb.id : tmdbId,
                        title: itemType === 'movie' ? title : undefined,
                        name: itemType === 'tv' ? title : undefined,
                        original_title: itemType === 'movie' ? originalTitle : undefined,
                        original_name: itemType === 'tv' ? originalTitle : undefined,
                        overview: (tmdb && tmdb.overview) ? tmdb.overview : (item.overview || ''),
                        poster_path: tmdb ? tmdb.poster_path : null,
                        img: (tmdb && tmdb.poster_path) ? undefined : simklPoster,
                        vote_average: tmdb ? tmdb.vote_average : (item.users_rating || 0),
                        release_date: tmdb ? tmdb.release_date : (item.year ? item.year.toString() : ''),
                        first_air_date: tmdb ? tmdb.first_air_date : (item.year ? item.year.toString() : ''),
                        method: itemType
                    });
                }, function () {
                    // Фолбек, якщо TMDB недоступний
                    finish({
                        id: tmdbId,
                        title: itemType === 'movie' ? item.title : undefined,
                        name: itemType === 'tv' ? item.title : undefined,
                        original_title: itemType === 'movie' ? item.title : undefined,
                        original_name: itemType === 'tv' ? item.title : undefined,
                        overview: item.overview || '',
                        img: simklPoster,
                        vote_average: item.users_rating || 0,
                        release_date: item.year ? item.year.toString() : '',
                        first_air_date: item.year ? item.year.toString() : '',
                        method: itemType
                    });
                });
            } else {
                finish(null);
            }
        });
    }

    /**
     * Компонент головної сторінки плагіна
     */
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
                        var cat = categories[parseInt(key, 10)];
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
                fetchCategoryData(cat, 1, 40, function (data) {
                    if (data && data.results) {
                        status.append(index.toString(), data);
                    } else {
                        status.error();
                    }
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

    /**
     * Компонент окремої категорії (з пагінацією)
     */
    function UltimateGoView(object) {
        var comp = new Lampa.InteractionCategory(object);

        comp.create = function () {
            var _this = this;
            fetchCategoryData(object.catObject, 1, 60, function (json) {
                if (json && json.results && json.results.length) {
                    _this.build(json);
                } else {
                    _this.empty();
                }
            });
        };

        comp.nextPageReuest = function (objectData, resolve, reject) {
            fetchCategoryData(object.catObject, objectData.page, 60, function (json) {
                if (json && json.results && json.results.length) {
                    resolve(json);
                } else {
                    reject();
                }
            });
        };

        return comp;
    }

    /**
     * Ініціалізація та додавання кнопки в меню
     */
    function startPlugin() {
        if (window.plugin_ultimatego_ready) return;
        window.plugin_ultimatego_ready = true;

        Lampa.Component.add('ultimatego_main', UltimateGoMain);
        Lampa.Component.add('ultimatego_view', UltimateGoView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="ultimatego"]').length) return;

            var btn = $('<li class="menu__item selector" data-action="ultimatego">' +
                '<div class="menu__ico">' + CONFIG.icon + '</div>' +
                '<div class="menu__text">' + CONFIG.title + '</div>' +
                '</li>');

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
                if (e.type === 'ready') addMenuButton();
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
