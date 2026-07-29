(function () {
    'use strict';

    // Jikan API (Офіційний публічний REST API MyAnimeList)
    const MAL_API = 'https://api.jikan.moe/v4';

    // Категорії
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
     * Проксі для завантаження обкладинок (обходить блокування CDN MyAnimeList на Smart TV)
     */
    function getProxyImg(url) {
        if (!url) return './img/img_broken.svg';
        return 'https://wsrv.nl/?url=' + encodeURIComponent(url);
    }

    /**
     * Форматування об'єкта аніме з MAL
     */
    function formatAnimeItem(item) {
        const romajiTitle = item.title || item.title_english || item.title_japanese || '';
        const imgUrl = item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || '';

        return {
            mal_id: item.mal_id, // Змінено з 'id' на 'mal_id', щоб Lampa не плутала з TMDB ID
            title: romajiTitle,
            name: romajiTitle,
            title_english: item.title_english || '',
            original_title: item.title_japanese || romajiTitle,
            original_name: item.title_japanese || romajiTitle,
            poster_path: getProxyImg(imgUrl),
            img: getProxyImg(imgUrl),
            vote_average: item.score || 0,
            first_air_date: item.aired?.from ? item.aired.from.split('T')[0] : '',
            release_date: item.aired?.from ? item.aired.from.split('T')[0] : '',
            overview: item.synopsis || '',
            type: item.type === 'Movie' ? 'movie' : 'tv'
        };
    }

    /**
     * Пошук картки в TMDB за назвою з MAL
     */
    function openAnimeInTMDB(data) {
        Lampa.Loading.start();

        const searchTitle = data.title || data.name;
        const lang = Lampa.Storage.get('language', 'uk');

        function executeSearch(query, onFail) {
            const tmdbUrl = Lampa.TMDB.api('search/multi?query=' + encodeURIComponent(query) + '&api_key=' + Lampa.TMDB.key() + '&language=' + lang);

            network.silent(tmdbUrl, (res) => {
                if (res && res.results && res.results.length > 0) {
                    // Пріоритет: Жанр Animation (16) або країна Японія (JP)
                    let match = res.results.find(r => {
                        const isMedia = r.media_type === 'tv' || r.media_type === 'movie';
                        const isAnime = (r.genre_ids && r.genre_ids.includes(16)) || 
                                        (r.origin_country && r.origin_country.includes('JP'));
                        return isMedia && isAnime;
                    });

                    if (!match) {
                        match = res.results.find(r => r.media_type === 'tv' || r.media_type === 'movie');
                    }

                    if (match) {
                        Lampa.Loading.stop();
                        Lampa.Activity.push({
                            url: '',
                            component: 'full',
                            id: match.id,
                            method: match.media_type || (data.type === 'movie' ? 'movie' : 'tv'),
                            card: match
                        });
                        return;
                    }
                }
                onFail();
            }, () => onFail());
        }

        // Перша спроба: за назвою Romaji
        executeSearch(searchTitle, () => {
            // Друга спроба: за англійською назвою (якщо вона відрізняється)
            if (data.title_english && data.title_english !== searchTitle) {
                executeSearch(data.title_english, () => {
                    Lampa.Loading.stop();
                    Lampa.Activity.push({
                        url: '',
                        title: searchTitle,
                        component: 'search',
                        query: searchTitle
                    });
                });
            } else {
                Lampa.Loading.stop();
                Lampa.Activity.push({
                    url: '',
                    title: searchTitle,
                    component: 'search',
                    query: searchTitle
                });
            }
        });
    }

    // Шар API
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

            // Затримка між запитами (захист від ліміту Jikan API 429)
            categories.forEach((cat, index) => {
                setTimeout(() => {
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
                    }, () => status.error());
                }, index * 300);
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

    // Компонент головної сторінки
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
                openAnimeInTMDB(element);
            };
        };

        return comp;
    }

    // Компонент категорії
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
                openAnimeInTMDB(element);
            };
        };

        return comp;
    }

    // Реєстрація плагіна
    function startPlugin() {
        window.mal_anime_plugin = true;

        let manifest = {
            type: 'anime',
            version: '1.3.0',
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
