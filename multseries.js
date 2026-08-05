(function () {
    'use strict';

    var ANIM_TV_CONFIG = {
        title: 'Мультсеріали',
        icon: '<svg viewBox="0 0 24 24" fill="#FF5722" xmlns="http://www.w3.org/2000/svg"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>',
        categories: [
            // --- 1. СВІЖАЧОК (УСІ ВІКОВІ КАТЕГОРІЇ) ---
            { 
                "title": "🔥 Свіжачок (За рік)", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16", 
                    "without_genres": "10763,10764,10767", 
                    "without_original_language": "ru,be,ja,ko,zh,cn",
                    "first_air_date.gte": "{one_year_ago}", 
                    "first_air_date.lte": "{current_date}",
                    "vote_count.gte": "10",
                    "sort_by": "popularity.desc" 
                } 
            },

            // --- 2. ВІКОВІ КАТЕГОРІЇ ---
            { 
                "title": "🔞Дорослим", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16", 
                    "without_genres": "10763,10764,10767", 
                    "without_original_language": "ru,be,ja,ko,zh,cn",
                    "with_keywords": "210024|283626|208364",
                    "vote_count.gte": "20",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "🧢 Підліткам", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16,10759", 
                    "without_genres": "10763,10764,10767", 
                    "without_original_language": "ru,be,ja,ko,zh,cn",
                    "without_keywords": "210024,283626",
                    "vote_count.gte": "30",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "👶 Малюкам", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16,10762", 
                    "without_genres": "10763,10764,10767", 
                    "without_original_language": "ru,be,ja,ko,zh,cn",
                    "without_keywords": "210024,283626",
                    "vote_count.gte": "10",
                    "sort_by": "popularity.desc" 
                } 
            },

            // --- 3. КУЛЬТОВІ ЗІ СВІТУ (ЗА МОВАМИ ТА РЕГІОНАМИ) ---
            { 
                "title": "Британські колонії", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16", 
                    "without_genres": "10763,10764,10767", 
                    "with_original_language": "en",
                    "without_keywords": "210024,283626",
                    "vote_count.gte": "100",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "Європейська експансія", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16", 
                    "without_genres": "10763,10764,10767", 
                    "with_original_language": "fr|de|it|es|sv|da|no|pl|nl|pt|cs|hu|ro|fi|el|uk",
                    "without_keywords": "210024,283626",
                    "vote_count.gte": "20",
                    "sort_by": "vote_count.desc" 
                } 
            },

            // --- 4. ЖАНРИ ---
            { 
                "title": "⚔️ Бойовики та Пригоди", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16,10759", 
                    "without_genres": "10763,10764,10767", 
                    "without_original_language": "ru,be,ja,ko,zh,cn",
                    "without_keywords": "210024,283626",
                    "vote_count.gte": "30",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "😂 Комедії", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16,35", 
                    "without_genres": "10763,10764,10767", 
                    "without_original_language": "ru,be,ja,ko,zh,cn",
                    "without_keywords": "210024,283626",
                    "vote_count.gte": "30",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🔎 Детективи & Таємниці", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16,9648", 
                    "without_genres": "10763,10764,10767", 
                    "without_original_language": "ru,be,ja,ko,zh,cn",
                    "without_keywords": "210024,283626",
                    "vote_count.gte": "20",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "🚀 Фантастика та Фентезі", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16,10765", 
                    "without_genres": "10763,10764,10767", 
                    "without_original_language": "ru,be,ja,ko,zh,cn",
                    "without_keywords": "210024,283626",
                    "vote_count.gte": "30",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "👨‍👩‍👧 Сімейні", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16,10751", 
                    "without_genres": "10763,10764,10767", 
                    "without_original_language": "ru,be,ja,ko,zh,cn",
                    "without_keywords": "210024,283626",
                    "vote_count.gte": "30",
                    "sort_by": "vote_count.desc" 
                } 
            },

            // --- 5. ДЕСЯТИЛІТТЯ ---
            { 
                "title": "⚡ 2020-ті роки", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16", 
                    "without_genres": "10763,10764,10767", 
                    "without_original_language": "ru,be,ja,ko,zh,cn",
                    "without_keywords": "210024,283626",
                    "first_air_date.gte": "2020-01-01", 
                    "vote_count.gte": "20",
                    "sort_by": "popularity.desc" 
                } 
            },
            { 
                "title": "💎 2010-ті роки", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16", 
                    "without_genres": "10763,10764,10767", 
                    "without_original_language": "ru,be,ja,ko,zh,cn",
                    "without_keywords": "210024,283626",
                    "first_air_date.gte": "2010-01-01", 
                    "first_air_date.lte": "2019-12-31", 
                    "vote_count.gte": "30",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "💿 2000-ні роки", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16", 
                    "without_genres": "10763,10764,10767", 
                    "without_original_language": "ru,be,ja,ko,zh,cn",
                    "without_keywords": "210024,283626",
                    "first_air_date.gte": "2000-01-01", 
                    "first_air_date.lte": "2009-12-31", 
                    "vote_count.gte": "30",
                    "sort_by": "vote_count.desc" 
                } 
            },
            { 
                "title": "📼 1990-ті роки", 
                "url": "discover/tv", 
                "params": { 
                    "with_genres": "16", 
                    "without_genres": "10763,10764,10767", 
                    "without_original_language": "ru,be,ja,ko,zh,cn",
                    "without_keywords": "210024,283626",
                    "first_air_date.gte": "1990-01-01", 
                    "first_air_date.lte": "1999-12-31", 
                    "vote_count.gte": "20",
                    "sort_by": "vote_count.desc" 
                } 
            }
        ]
    };

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

            jsonUk.results = jsonUk.results.filter(function (item) {
                item.media_type = 'tv';
                return item.poster_path;
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
                                item.name = enTitle;
                                item.title = enTitle;
                            } else if (item.original_name && !hasAsianScript(item.original_name)) {
                                item.name = item.original_name;
                                item.title = item.original_name;
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

    function AnimTvMain(object) {
        var comp = new Lampa.InteractionMain(object);

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var categories = ANIM_TV_CONFIG.categories;
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
                component: 'anim_tv_catalog_view',
                page: 1
            });
        };

        return comp;
    }

    function AnimTvView(object) {
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
        if (window.plugin_anim_tv_catalog_ready) return;
        window.plugin_anim_tv_catalog_ready = true;

        Lampa.Component.add('anim_tv_catalog_main', AnimTvMain);
        Lampa.Component.add('anim_tv_catalog_view', AnimTvView);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="anim_tv_catalog"]').length) return;

            var btn = $('<li class="menu__item selector" data-action="anim_tv_catalog">' +
                '<div class="menu__ico">' + ANIM_TV_CONFIG.icon + '</div>' +
                '<div class="menu__text">' + ANIM_TV_CONFIG.title + '</div>' +
            '</li>');

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: ANIM_TV_CONFIG.title,
                    component: 'anim_tv_catalog_main',
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

    if (!window.plugin_anim_tv_catalog_ready) startPlugin();
})();
