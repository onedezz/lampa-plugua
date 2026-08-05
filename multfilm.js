(function () {
    'use strict';

    /**
     * ANIMATED FEATURE MOVIES CATALOG FOR LAMPA
     * Мультфільми з жорсткою JS-фільтрацією азійського контенту (Японія, Корея, Китай) та підтримкою ES5.
     */

    var ANIMATION_CONFIG = {
        title: 'Мультфільми',
        icon: '<svg viewBox="0 0 24 24" fill="#FF9800" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>',
        categories: [
            // --- 1. СВІЖАЧОК ---
            { 
                "title": "🔥 Свіжачок (За рік)", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "primary_release_date.gte": "{one_year_ago}", 
                    "primary_release_date.lte": "{current_date}",
                    "vote_count.gte": "10",
                    "sort_by": "popularity.desc" 
                } 
            },

            // --- 2. КУЛЬТОВІ ЗІ СВІТУ (ЗА МОВАМИ ТА РЕГІОНАМИ) ---
            { 
                "title": "Британські колонії", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "en",
                    "vote_count.gte": "200",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "Європейська експансія", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "with_original_language": "fr|de|it|es|sv|da|no|pl|nl|pt|cs|hu|ro|fi|el|uk",
                    "vote_count.gte": "30",
                    "sort_by": "vote_count.desc" 
                } 
            },

            // --- 3. ЖАНРИ ---
            { 
                "title": "🤠 Пригоди", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,12", 
                    "vote_count.gte": "50",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "😂 Комедії", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,35", 
                    "vote_count.gte": "50",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "👨‍👩‍👧 Сімейні", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,10751", 
                    "vote_count.gte": "50",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🧙‍♂️ Фентезі", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,14", 
                    "vote_count.gte": "50",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🚀 Фантастика", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,878", 
                    "vote_count.gte": "50",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "⚔️ Бойовики / Екшн", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,28", 
                    "vote_count.gte": "50",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🔎 Детективи & Таємниці", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,9648", 
                    "vote_count.gte": "30",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🎼 Мюзикли & Музичні", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16,10402", 
                    "vote_count.gte": "30",
                    "sort_by": "vote_count.desc" 
                } 
            },

            // --- 4. ДЕСЯТИЛІТТЯ ---
            { 
                "title": "⚡ 2020-ті роки", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "primary_release_date.gte": "2020-01-01", 
                    "vote_count.gte": "30",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "💎 2010-ті роки", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "primary_release_date.gte": "2010-01-01", 
                    "primary_release_date.lte": "2019-12-31", 
                    "vote_count.gte": "50",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "💿 2000-ні роки", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "primary_release_date.gte": "2000-01-01", 
                    "primary_release_date.lte": "2009-12-31", 
                    "vote_count.gte": "50",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "📼 1990-ті роки", 
                "url": "discover/movie", 
                "params": { 
                    "with_genres": "16", 
                    "primary_release_date.gte": "1990-01-01", 
                    "primary_release_date.lte": "1999-12-31", 
                    "vote_count.gte": "30",
                    "sort_by": "vote_count.desc" 
                } 
            }
        ]
    };

    var BLOCKED_LANGS = ['ja', 'ko', 'zh', 'cn', 'ru', 'be'];
    var BLOCKED_COUNTRIES = ['JP', 'KR', 'CN', 'TW', 'HK', 'RU', 'BY'];

    function isAsianOrBlocked(item) {
        if (!item) return true;
        
        var lang = (item.original_language || '').toLowerCase();
        if (BLOCKED_LANGS.indexOf(lang) !== -1) {
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
        return false;
    }

    function hasAsianScript(text) {
        if (!text) return false;
        return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/.test(text);
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

    function fetchWithFallback(catUrl, catParams, page, callback) {
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

            // ЖОРСТКИЙ ФІЛЬТР: відсікаємо азійський контент, серіальні маркери та картки без постерів
            jsonUk.results = jsonUk.results.filter(function (item) {
                item.media_type = 'movie';
                delete item.name;
                if (isAsianOrBlocked(item)) return false;
                return !!item.poster_path;
            });

            var needsEnglish = jsonUk.results.some(function (item) {
                var title = item.title || '';
                return !title || hasAsianScript(title);
            });

            if (needsEnglish) {
                var urlEn = buildQuery('en');
                network.silent(urlEn, function (jsonEn) {
                    var enMap = {};
                    if (jsonEn && jsonEn.results) {
                        jsonEn.results.forEach(function (enItem) {
                            enMap[enItem.id] = enItem.title || '';
                        });
                    }

                    jsonUk.results.forEach(function (item) {
                        var title = item.title || '';
                        if (!title || hasAsianScript(title)) {
                            var enTitle = enMap[item.id];
                            if (enTitle && !hasAsianScript(enTitle)) {
                                item.title = enTitle;
                            } else if (item.original_title && !hasAsianScript(item.original_title)) {
                                item.title = item.original_title;
                            }
                        }
                        delete item.name;
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

    function AnimationMain(object) {
        var comp = new Lampa.InteractionMain(object);

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var categories = ANIMATION_CONFIG.categories;
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
                fetchWithFallback(cat.url, cat.params, 1, function (json) {
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
                component: 'animation_catalog_view',
                page: 1
            });
        };

        return comp;
    }

    function AnimationView(object) {
        var comp = new Lampa.InteractionCategory(object);

        comp.create = function () {
            var _this = this;
            fetchWithFallback(object.url, object.params, 1, function (json) {
                if (json) _this.build(json);
                else _this.empty();
            });
        };

        comp.nextPageReuest = function (objectData, resolve, reject) {
            fetchWithFallback(object.url, object.params, objectData.page, function (json) {
                if (json) resolve(json);
                else reject();
            });
        };

        return comp;
    }

    function startPlugin() {
        if (window.plugin_animation_catalog_ready) return;
        window.plugin_animation_catalog_ready = true;

        Lampa.Component.add('animation_catalog_main', AnimationMain);
        Lampa.Component.add('animation_catalog_view', AnimationView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="animation_catalog"]').length) return;

            var btn = $('<li class="menu__item selector" data-action="animation_catalog">' +
                '<div class="menu__ico">' + ANIMATION_CONFIG.icon + '</div>' +
                '<div class="menu__text">' + ANIMATION_CONFIG.title + '</div>' +
            '</li>');

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: ANIMATION_CONFIG.title,
                    component: 'animation_catalog_main',
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

    if (!window.plugin_animation_catalog_ready) startPlugin();
})();
