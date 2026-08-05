(function () {
    'use strict';

    /**
     * WESTERN ANIMATION CATALOG FOR LAMPA
     * Тільки Свіжачок та Десятиліття (Окремо Мультфільми та Мультсеріали).
     * Повністю без аніме та азійської продукції, з пом'якшеними порогами видачі.
     */

    var WESTERN_ANIM_CONFIG = {
        title: 'Мультфільми & Серіали',
        icon: '<svg viewBox="0 0 24 24" fill="#FF9800" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>',
        categories: [
            // --- 1. СВІЖАЧОК ---
            { 
                "title": "🔥 Свіжачок — Мультфільми (За рік)", 
                "url": "discover/movie", 
                "is_tv": false,
                "params": { 
                    "with_genres": "16", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "1",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🔥 Свіжачок — Мультсеріали (За рік)", 
                "url": "discover/tv", 
                "is_tv": true,
                "params": { 
                    "with_genres": "16", 
                    "without_genres": "10763,10764,10767", 
                    "first_air_date.gte": "{one_year_ago}", 
                    "first_air_date.lte": "{current_date}",
                    "vote_count.gte": "1",
                    "sort_by": "popularity.desc" 
                } 
            },

            // --- 2. ДЕСЯТИЛІТТЯ ---
            { 
                "title": "⚡ 2020-ті роки — Мультфільми", 
                "url": "discover/movie", 
                "is_tv": false,
                "params": { 
                    "with_genres": "16", 
                    "primary_release_date.gte": "2020-01-01", 
                    "vote_count.gte": "5",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "⚡ 2020-ті роки — Мультсеріали", 
                "url": "discover/tv", 
                "is_tv": true,
                "params": { 
                    "with_genres": "16", 
                    "without_genres": "10763,10764,10767", 
                    "first_air_date.gte": "2020-01-01", 
                    "vote_count.gte": "5",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "💎 2010-ті роки — Мультфільми", 
                "url": "discover/movie", 
                "is_tv": false,
                "params": { 
                    "with_genres": "16", 
                    "primary_release_date.gte": "2010-01-01", 
                    "primary_release_date.lte": "2019-12-31", 
                    "vote_count.gte": "10",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "💎 2010-ті роки — Мультсеріали", 
                "url": "discover/tv", 
                "is_tv": true,
                "params": { 
                    "with_genres": "16", 
                    "without_genres": "10763,10764,10767", 
                    "first_air_date.gte": "2010-01-01", 
                    "first_air_date.lte": "2019-12-31", 
                    "vote_count.gte": "10",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "💿 2000-ні роки — Мультфільми", 
                "url": "discover/movie", 
                "is_tv": false,
                "params": { 
                    "with_genres": "16", 
                    "primary_release_date.gte": "2000-01-01", 
                    "primary_release_date.lte": "2009-12-31", 
                    "vote_count.gte": "10",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "💿 2000-ні роки — Мультсеріали", 
                "url": "discover/tv", 
                "is_tv": true,
                "params": { 
                    "with_genres": "16", 
                    "without_genres": "10763,10764,10767", 
                    "first_air_date.gte": "2000-01-01", 
                    "first_air_date.lte": "2009-12-31", 
                    "vote_count.gte": "10",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "📼 1990-ті роки — Мультфільми", 
                "url": "discover/movie", 
                "is_tv": false,
                "params": { 
                    "with_genres": "16", 
                    "primary_release_date.gte": "1990-01-01", 
                    "primary_release_date.lte": "1999-12-31", 
                    "vote_count.gte": "5",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "📼 1990-ті роки — Мультсеріали", 
                "url": "discover/tv", 
                "is_tv": true,
                "params": { 
                    "with_genres": "16", 
                    "without_genres": "10763,10764,10767", 
                    "first_air_date.gte": "1990-01-01", 
                    "first_air_date.lte": "1999-12-31", 
                    "vote_count.gte": "5",
                    "sort_by": "vote_count.desc" 
                } 
            }
        ]
    };

    var BLOCKED_LANGS = ['ja', 'ko', 'zh', 'cn', 'ru', 'be'];
    var BLOCKED_COUNTRIES = ['JP', 'KR', 'CN', 'TW', 'HK', 'RU', 'BY'];

    function hasAsianScript(text) {
        if (!text) return false;
        return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/.test(text);
    }

    function isAsianOrBlocked(item) {
        if (!item) return true;
        
        var lang = (item.original_language || '').toLowerCase();
        if (BLOCKED_LANGS.indexOf(lang) !== -1 || lang.indexOf('zh') === 0) {
            return true;
        }

        if (item.origin_country && Array.isArray(item.origin_country)) {
            for (var i = 0; i < item.origin_country.length; i++) {
                var country = item.origin_country[i].toUpperCase();
                if (BLOCKED_COUNTRIES.indexOf(country) !== -1) {
                    return true;
                }
            }
        }

        if (hasAsianScript(item.original_name) || hasAsianScript(item.original_title)) {
            return true;
        }

        return false;
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

    function fetchWithFallback(catUrl, catParams, isTv, page, callback) {
        var network = new Lampa.Reguest();
        
        function buildQuery(lang) {
            var params = [];
            params.push('api_key=' + Lampa.TMDB.key());
            params.push('language=' + lang);
            if (page) params.push('page=' + page);

            if (catParams) {
                for (var key in catParams) {
                    var val = catParams[key];
                    val = resolveParamValue(val);
                    params.push(key + '=' + val);
                }
            }
            return Lampa.TMDB.api(catUrl + '?' + params.join('&'));
        }

        var urlUk = buildQuery(Lampa.Storage.get('language', 'uk'));

        network.silent(urlUk, function (jsonUk) {
            if (!jsonUk || !jsonUk.results || !jsonUk.results.length) {
                return callback(jsonUk);
            }

            jsonUk.results = jsonUk.results.filter(function (item) {
                if (isTv) {
                    item.media_type = 'tv';
                } else {
                    item.media_type = 'movie';
                    delete item.name;
                }

                if (isAsianOrBlocked(item)) return false;
                return !!item.poster_path;
            });

            var needsEnglish = jsonUk.results.some(function (item) {
                var title = item.name || item.title || '';
                return !title || hasAsianScript(title);
            });

            if (needsEnglish) {
                var urlEn = buildQuery('en');
                network.silent(urlEn, function (jsonEn) {
                    var enMap = {};
                    if (jsonEn && jsonEn.results) {
                        jsonEn.results.forEach(function (enItem) {
                            enMap[enItem.id] = enItem.name || enItem.title || '';
                        });
                    }

                    jsonUk.results.forEach(function (item) {
                        var title = item.name || item.title || '';
                        if (!title || hasAsianScript(title)) {
                            var enTitle = enMap[item.id];
                            if (enTitle && !hasAsianScript(enTitle)) {
                                if (isTv) {
                                    item.name = enTitle;
                                    item.title = enTitle;
                                } else {
                                    item.title = enTitle;
                                    delete item.name;
                                }
                            } else if (item.original_name || item.original_title) {
                                var orig = item.original_name || item.original_title;
                                if (!hasAsianScript(orig)) {
                                    if (isTv) {
                                        item.name = orig;
                                        item.title = orig;
                                    } else {
                                        item.title = orig;
                                        delete item.name;
                                    }
                                }
                            }
                        }
                    });

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

    function WesternAnimMain(object) {
        var comp = new Lampa.InteractionMain(object);

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var categories = WESTERN_ANIM_CONFIG.categories;
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
                            params: cat.params,
                            is_tv: cat.is_tv
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
                fetchWithFallback(cat.url, cat.params, cat.is_tv, 1, function (json) {
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
                is_tv: data.is_tv,
                title: data.title,
                component: 'western_anim_catalog_view',
                page: 1
            });
        };

        return comp;
    }

    function WesternAnimView(object) {
        var comp = new Lampa.InteractionCategory(object);

        comp.create = function () {
            var _this = this;
            fetchWithFallback(object.url, object.params, object.is_tv, 1, function (json) {
                if (json) _this.build(json);
                else _this.empty();
            });
        };

        comp.nextPageReuest = function (objectData, resolve, reject) {
            fetchWithFallback(object.url, object.params, object.is_tv, objectData.page, function (json) {
                if (json) resolve(json);
                else reject();
            });
        };

        return comp;
    }

    function startPlugin() {
        if (window.plugin_western_anim_catalog_ready) return;
        window.plugin_western_anim_catalog_ready = true;

        Lampa.Component.add('western_anim_catalog_main', WesternAnimMain);
        Lampa.Component.add('western_anim_catalog_view', WesternAnimView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="western_anim_catalog"]').length) return;

            var btn = $('<li class="menu__item selector" data-action="western_anim_catalog">' +
                '<div class="menu__ico">' + WESTERN_ANIM_CONFIG.icon + '</div>' +
                '<div class="menu__text">' + WESTERN_ANIM_CONFIG.title + '</div>' +
            '</li>');

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: WESTERN_ANIM_CONFIG.title,
                    component: 'western_anim_catalog_main',
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

    if (!window.plugin_western_anim_catalog_ready) startPlugin();
})();
