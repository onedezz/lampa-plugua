(function () {
    'use strict';

    /**
     * ASIAN LIVE-ACTION MOVIES (DORAMA FILMS) - NATIVE ENGINE
     * Південнокорейські та Японські художні фільми (Без аніме та TV-шоу)
     */

    var CONFIG = {
        title: 'Дорами Фільми',
        icon: '<svg viewBox="0 0 24 24" fill="#9C27B0" xmlns="http://www.w3.org/2000/svg"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H9l2 4H8L6 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>',
        categories: [
            // --- 1. ПОПУЛЯРНЕ ТА ТРЕНДИ ---
            { title: "⭐ Популярні дорами (фільми)", params: "&sort_by=popularity.desc&vote_count.gte=50" },
            { title: "📈 Новинки та релізи", params: "&sort_by=primary_release_date.desc&vote_count.gte=5" },

            // --- 2. ДЕСЯТИЛІТТЯ ---
            { title: "⚡ Сучасність 2020-х", params: "&sort_by=popularity.desc&primary_release_date.gte=2020-01-01" },
            { title: "💎 Ера 2010-х", params: "&sort_by=popularity.desc&primary_release_date.gte=2010-01-01&primary_release_date.lte=2019-12-31&vote_count.gte=30" },
            { title: "💿 Культові 2000-ні", params: "&sort_by=popularity.desc&primary_release_date.gte=2000-01-01&primary_release_date.lte=2009-12-31&vote_count.gte=20" },
            { title: "📼 1990-ті", params: "&sort_by=popularity.desc&primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31&vote_count.gte=10" },

            // --- 3. ЖАНРИ ---
            { title: "🔪 Трилери", params: "&with_genres=53&sort_by=popularity.desc" },
            { title: "🔎 Детективи", params: "&with_genres=9648&sort_by=popularity.desc" },
            { title: "⚔️ Бойовики", params: "&with_genres=28&sort_by=popularity.desc" },
            { title: "😱 Жахи", params: "&with_genres=27&sort_by=popularity.desc" },
            { title: "😂 Комедії", params: "&with_genres=35&sort_by=popularity.desc" },
            { title: "🎭 Драми", params: "&with_genres=18&sort_by=popularity.desc" },
            { title: "💖 Романтика", params: "&with_genres=10749&sort_by=popularity.desc" },
            { title: "🚀 Фантастика та Фентезі", params: "&with_genres=878,14&sort_by=popularity.desc" },
            { title: "🚨 Кримінал", params: "&with_genres=80&sort_by=popularity.desc" }
        ]
    };

    var BASE_DISCOVER_URL = 'movie?with_origin_country=KR|JP&without_genres=16';

    function hasCJK(str) {
        return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\uac00-\ud7af]/.test(str || '');
    }

    function formatTmdbResults(results) {
        if (!Array.isArray(results)) return [];
        return results.map(function (item) {
            var displayTitle = item.title;
            if (hasCJK(displayTitle)) {
                displayTitle = item.original_title || item.title;
            }
            return {
                id: item.id,
                title: displayTitle,
                original_title: item.original_title || '',
                overview: item.overview || '',
                poster_path: item.poster_path,
                backdrop_path: item.backdrop_path,
                vote_average: item.vote_average || 0,
                release_date: item.release_date || '',
                method: 'movie'
            };
        });
    }

    function fetchDoramaPage(categoryParams, page, callback) {
        var lang = Lampa.Storage.get('language', 'uk');
        var url = BASE_DISCOVER_URL + categoryParams + '&page=' + page;
        var fullUrl = Lampa.TMDB.api(url + '&api_key=' + Lampa.TMDB.key() + '&language=' + lang);

        var net = new Lampa.Reguest();
        net.silent(fullUrl, function (response) {
            if (response && response.results) {
                callback({
                    results: formatTmdbResults(response.results),
                    page: response.page || page,
                    total_pages: response.total_pages || 1
                });
            } else {
                callback(null);
            }
        }, function () {
            callback(null);
        });
    }

    function DoramaMoviesMain(object) {
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
                        Lampa.Utils.extendItemsParams(data.results, { style: { name: 'wide' } });
                        fulldata.push({
                            title: cat.title,
                            results: data.results,
                            url: cat.params
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
                fetchDoramaPage(cat.params, 1, function (data) {
                    if (data && data.results && data.results.length) {
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
                url: data.url,
                title: data.title,
                component: 'doramafilm_view',
                page: 1
            });
        };

        return comp;
    }

    function DoramaMoviesView(object) {
        var comp = new Lampa.InteractionCategory(object);

        comp.create = function () {
            var _this = this;
            fetchDoramaPage(object.url, 1, function (json) {
                if (json && json.results && json.results.length) {
                    _this.build(json);
                } else {
                    _this.empty();
                }
            });
        };

        comp.nextPageReuest = function (objectData, resolve, reject) {
            fetchDoramaPage(object.url, objectData.page, function (json) {
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
        if (window.plugin_doramafilm_native_ready) return;
        window.plugin_doramafilm_native_ready = true;

        Lampa.Component.add('doramafilm_main', DoramaMoviesMain);
        Lampa.Component.add('doramafilm_view', DoramaMoviesView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="doramafilm_native"]').length) return;

            var btn = $(`<li class="menu__item selector" data-action="doramafilm_native">
                <div class="menu__ico">${CONFIG.icon}</div>
                <div class="menu__text">${CONFIG.title}</div>
            </li>`);

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: CONFIG.title,
                    component: 'doramafilm_main',
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

    if (!window.plugin_doramafilm_native_ready) startPlugin();
})();
