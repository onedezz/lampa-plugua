(function () {
    'use strict';

    /**
     * EXTERNAL API ANIMATED TV SHOWS PLUGIN FOR LAMPA
     * Demonstrates fetching from an external API and mapping to TMDB objects.
     */

    var API_CONFIG = {
        title: 'Мультсеріали (External API)',
        icon: '<svg viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/><path d="M9.5 7.5v7l5.5-3.5z" fill="#ffffff"/></svg>',
        
        // Приклад ендпоінтів стороннього API (Trakt / TVMaze / Custom API)
        categories: [
            { title: "🔥 Трендові мультсеріали", type: "trending" },
            { title: "⭐ Найвищий рейтинг спільноти", type: "popular" },
            { title: "⚡ Найдешевші свіжі новинки", type: "recent" }
        ]
    };

    // 1. Хелпер для конвертації об'єкта стороннього API у формат Lampa TMDB
    function mapExternalToLampa(externalItem) {
        // Якщо API повертає TMDB ID напряму (наприклад, Trakt API):
        var tmdbId = externalItem.ids ? externalItem.ids.tmdb : externalItem.tmdb_id;

        return {
            id: tmdbId, // Головний TMDB ID для сумісності з плеєрами та торентами
            name: externalItem.title || externalItem.name,
            original_name: externalItem.original_title || externalItem.original_name,
            overview: externalItem.overview || externalItem.summary || '',
            poster_path: externalItem.poster_path ? (externalItem.poster_path.startsWith('http') ? externalItem.poster_path : externalItem.poster_path) : null,
            vote_average: externalItem.rating || externalItem.vote_average || 0,
            first_air_date: externalItem.first_air_date || externalItem.year ? externalItem.year.toString() : '',
            method: 'tv' // Вказуємо Lampa, що це серіал
        };
    }

    // 2. Пошуковий фолбек (якщо стороннє API не має готового tmdb_id)
    function resolveTmdbId(item, callback) {
        if (item.id) return callback(item); // TMDB ID вже є

        var searchUrl = Lampa.TMDB.api('search/tv?api_key=' + Lampa.TMDB.key() + '&query=' + encodeURIComponent(item.name));
        var network = new Lampa.Reguest();
        
        network.silent(searchUrl, function (json) {
            if (json && json.results && json.results.length) {
                item.id = json.results[0].id; // Прив'язуємо знайдений TMDB ID
                if (!item.poster_path) item.poster_path = json.results[0].poster_path;
            }
            callback(item);
        }, function () {
            callback(item);
        });
    }

    // 3. Компонент відображення списків
    function ExternalAnimatedTvMain(object) {
        var comp = new Lampa.InteractionMain(object);

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var categories = API_CONFIG.categories;
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
                            results: data.results
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

            // Запит даних із зовнішнього API
            categories.forEach(function (cat, index) {
                // Приклад запиту до вашого стороннього API або Trakt.tv
                var externalApiUrl = 'https://api.example.com/animated-series/' + cat.type;
                var network = new Lampa.Reguest();

                network.silent(externalApiUrl, function (response) {
                    var rawList = response.items || response || [];
                    
                    // Мапимо тайтли під Lampa
                    var formattedResults = rawList.map(mapExternalToLampa).filter(function(i) {
                        return i.id && i.poster_path; // Залишаємо лише з валідними ID та постером
                    });

                    status.append(index.toString(), { results: formattedResults });
                }, function () {
                    status.error();
                });
            });

            return this.render();
        };

        // 4. Клік по картці -> перехід у рідну картку Lampa за TMDB ID
        comp.onItemSelect = function (item) {
            Lampa.Activity.push({
                url: '',
                component: 'full', // Відкриває стандартний інтерфейс картки Lampa
                id: item.id,       // TMDB ID
                method: 'tv',      // Режим серіалу
                card: item
            });
        };

        return comp;
    }

    function startPlugin() {
        if (window.plugin_external_animtv_ready) return;
        window.plugin_external_animtv_ready = true;

        Lampa.Component.add('external_animtv_main', ExternalAnimatedTvMain);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="external_animtv"]').length) return;

            var btn = $(`<li class="menu__item selector" data-action="external_animtv">
                <div class="menu__ico">${API_CONFIG.icon}</div>
                <div class="menu__text">${API_CONFIG.title}</div>
            </li>`);

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: API_CONFIG.title,
                    component: 'external_animtv_main',
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
    }

    if (!window.plugin_external_animtv_ready) startPlugin();
})();
