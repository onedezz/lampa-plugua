(function () {
    'use strict';

    // Jikan API (Публічний REST API для MyAnimeList)
    const MAL_API = 'https://api.jikan.moe/v4';

    // Список категорій
    const categories = [
        {
            id: 'airing',
            title: 'Онгоїнги',
            url: '/seasons/now'
        },
        {
            id: 'popular_tv',
            title: 'Популярне TV',
            url: '/top/anime?type=tv&filter=bypopularity'
        },
        {
            id: 'popular_movies',
            title: 'Популярні аніме фільми',
            url: '/top/anime?type=movie&filter=bypopularity'
        },
        {
            id: 'new_movies',
            title: 'Нові аніме фільми',
            url: '/top/anime?type=movie&filter=upcoming'
        },
        {
            id: 'top_rated',
            title: 'Найвищий рейтинг',
            url: '/top/anime?filter=bypopularity'
        },
        {
            id: 'upcoming',
            title: 'Анонси та очікувані',
            url: '/seasons/upcoming'
        }
    ];

    const network = new Lampa.Reguest();

    /**
     * Конвертує об'єкт аніме з MAL у формат карточки Lampa
     * Назва title у Jikan API за замовчуванням повертається в Romaji
     */
    function formatAnimeItem(item) {
        const romajiTitle = item.title || item.title_english || item.title_japanese;

        return {
            id: item.mal_id,
            name: romajiTitle,
            title: romajiTitle,
            original_name: item.title_japanese || romajiTitle,
            original_title: item.title_japanese || romajiTitle,
            poster_path: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url,
            img: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url,
            vote_average: item.score || 0,
            first_air_date: item.aired?.from ? item.aired.from.split('T')[0] : '',
            release_date: item.aired?.from ? item.aired.from.split('T')[0] : '',
            overview: item.synopsis || '',
            type: item.type === 'Movie' ? 'movie' : 'tv'
        };
    }

    // Шар API для Lampa
    const Api = {
        main(params, oncomplete, onerror) {
            let status = new Lampa.Status(categories.length);

            status.onComplite = () => {
                let keys = Object.keys(status.data);
                let sort = categories.map(a => a.id);

                if (keys.length) {
                    let fulldata = [];
                    keys.sort((a, b) => sort.indexOf(a) - sort.indexOf(b));

                    keys.forEach(key => {
                        let data = status.data[key];
                        fulldata.push(data);
                    });

                    oncomplete(fulldata);
                } else {
                    onerror();
                }
            };

            categories.forEach(cat => {
                let sep = cat.url.includes('?') ? '&' : '?';
                let url = `${MAL_API}${cat.url}${sep}page=1`;

                network.silent(url, (res) => {
                    if (res && res.data) {
                        let results = res.data.map(formatAnimeItem);
                        status.append(cat.id, {
                            title: cat.title,
                            category: cat.id,
                            results: results,
                            total_pages: res.pagination?.last_visible_page || 1
                        });
                    } else {
                        status.error();
                    }
                }, status.error.bind(status));
            });
        },

        category(params, oncomplete, onerror) {
            let cat = categories.find(c => c.id === params.url);
            if (!cat) return onerror();

            let page = params.page || 1;
            let sep = cat.url.includes('?') ? '&' : '?';
            let url = `${MAL_API}${cat.url}${sep}page=${page}`;

            network.silent(url, (res) => {
                if (res && res.data) {
                    let results = res.data.map(formatAnimeItem);
                    oncomplete({
                        results: results,
                        page: page,
                        total_pages: res.pagination?.last_visible_page || 1
                    });
                } else {
                    onerror();
                }
            }, onerror);
        }
    };

    // Компонент головної сторінки списків аніме
    function MainComponent(object) {
        let comp = new Lampa.InteractionMain(object);

        comp.create = function () {
            this.activity.loader(true);

            Api.main(object, (data) => {
                this.build(data);
            }, this.empty.bind(this));

            return this.render();
        };

        comp.onMore = function (data) {
            Lampa.Activity.push({
                url: data.category,
                title: data.title,
                component: 'mal_anime_category',
                page: 1
            });
        };

        comp.cardRender = function (object, element, card) {
            card.onEnter = () => {
                // Відкриває пошук Lampa / TMDB за назвою в Romaji
                Lampa.Activity.push({
                    url: '',
                    title: element.title,
                    component: 'search',
                    query: encodeURIComponent(element.title)
                });
            };
        };

        return comp;
    }

    // Компонент перегляду однієї категорії (з пагінацією та сіткою)
    function CategoryComponent(object) {
        let comp = new Lampa.InteractionCategory(object);

        comp.create = function () {
            Api.category(object, (data) => {
                this.build(data);
            }, this.empty.bind(this));
        };

        comp.nextPageReuest = function (object, resolve, reject) {
            Api.category(object, resolve.bind(comp), reject.bind(comp));
        };

        comp.cardRender = function (object, element, card) {
            card.onEnter = () => {
                Lampa.Activity.push({
                    url: '',
                    title: element.title,
                    component: 'search',
                    query: encodeURIComponent(element.title)
                });
            };
        };

        return comp;
    }

    // Ініціалізація плагіна
    function startPlugin() {
        window.mal_anime_plugin = true;

        let manifest = {
            type: 'anime',
            version: '1.0.0',
            name: 'MAL Anime',
            description: 'Каталог аніме з MyAnimeList (Romaji)',
            component: 'mal_anime_main',
        };

        Lampa.Manifest.plugins = manifest;

        Lampa.Component.add('mal_anime_main', MainComponent);
        Lampa.Component.add('mal_anime_category', CategoryComponent);

        function addMenuItem() {
            let button = $(`<li class="menu__item selector">
                <div class="menu__ico">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </div>
                <div class="menu__text">${manifest.name}</div>
            </li>`);

            button.on('hover:enter', function () {
                Lampa.Activity.push({
                    url: '',
                    title: manifest.name,
                    component: 'mal_anime_main',
                    page: 1
                });
            });

            $('.menu .menu__list').eq(0).append(button);
        }

        if (window.appready) addMenuItem();
        else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type === 'ready') addMenuItem();
            });
        }
    }

    if (!window.mal_anime_plugin) {
        startPlugin();
    }
})();
