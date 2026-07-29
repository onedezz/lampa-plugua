(function () {
    'use strict';

    // Jikan API (Офіційний публічний REST API MyAnimeList)
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
     * Конвертує об'єкт аніме з MAL у внутрішній формат
     */
    function formatAnimeItem(item) {
        const romajiTitle = item.title || item.title_english || item.title_japanese || '';
        const imgUrl = item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || item.images?.webp?.large_image_url || '';

        return {
            id: item.mal_id,
            title: romajiTitle,
            name: romajiTitle,
            title_english: item.title_english || '',
            title_japanese: item.title_japanese || '',
            poster_path: imgUrl,
            img: imgUrl,
            vote_average: item.score || 0,
            first_air_date: item.aired?.from ? item.aired.from.split('T')[0] : '',
            release_date: item.aired?.from ? item.aired.from.split('T')[0] : '',
            overview: item.synopsis || '',
            type: item.type === 'Movie' ? 'movie' : 'tv'
        };
    }

    /**
     * Шукає аніме в TMDB за назвою і відкриває відповідну картку TMDB
     */
    function openAnimeInTMDB(data) {
        Lampa.Loading.start();

        const titleToSearch = data.title || data.name || data.title_english;
        const lang = Lampa.Storage.get('language', 'uk');
        const searchUrl = Lampa.TMDB.api('search/multi?query=' + encodeURIComponent(titleToSearch) + '&api_key=' + Lampa.TMDB.key() + '&language=' + lang);

        network.silent(searchUrl, (res) => {
            Lampa.Loading.stop();

            if (res && res.results && res.results.length > 0) {
                // Пріоритет: Анімація (genre 16) або країна Японія (JP)
                let bestMatch = res.results.find(r => {
                    const isMedia = r.media_type === 'tv' || r.media_type === 'movie';
                    const isAnime = (r.genre_ids && r.genre_ids.includes(16)) || 
                                    (r.origin_country && r.origin_country.includes('JP'));
                    return isMedia && isAnime;
                });

                // Якщо за жанром не знайшли, беремо перший результат серіалу/фільму
                if (!bestMatch) {
                    bestMatch = res.results.find(r => r.media_type === 'tv' || r.media_type === 'movie');
                }

                if (bestMatch) {
                    Lampa.Activity.push({
                        url: '',
                        component: 'full',
                        id: bestMatch.id,
                        method: bestMatch.media_type || (data.type === 'movie' ? 'movie' : 'tv'),
                        card: bestMatch
                    });
                    return;
                }
            }

            // Якщо точно знайти не вдалося — відкриваємо пошукове вікно Lampa
            Lampa.Activity.push({
                url: '',
                title: titleToSearch,
                component: 'search',
                query: titleToSearch
            });
        }, () => {
            Lampa.Loading.stop();
            Lampa.Activity.push({
                url: '',
                title: titleToSearch,
                component: 'search',
                query: titleToSearch
            });
        });
    }

    /**
     * Кастомний клас Картки Аніме
     */
    function AnimeCard(data, params = {}) {
        this.data = data;

        this.build = function () {
            this.item = Lampa.Template.get('mal_anime_card', {});
            this.img = this.item.find('.card__img')[0];

            // Назва
            this.item.find('.card__title').text(data.title || data.name);

            // Рейтинг
            if (data.vote_average && data.vote_average > 0) {
                this.item.find('.card__vote').text(data.vote_average.toFixed(1));
            } else {
                this.item.find('.card__vote').remove();
            }

            // Лейбл типу (TV / MOVIE)
            if (data.type) {
                this.item.find('.card__type').text(data.type.toUpperCase());
            } else {
                this.item.find('.card__type').remove();
            }

            this.item.addEventListener('visible', this.visible.bind(this));
        };

        this.visible = function () {
            if (this.img && !this.loaded) {
                this.loaded = true;

                // КЛЮЧОВИЙ ФІКС ДЛЯ CDN MAL: Встановлюємо referrerpolicy ДО присвоєння src
                this.img.setAttribute('referrerpolicy', 'no-referrer');

                this.img.onload = () => {
                    this.item.classList.add('card--loaded');
                };

                this.img.onerror = () => {
                    this.img.src = './img/img_broken.svg';
                };

                const imageUrl = data.img || data.poster_path;
                if (imageUrl) {
                    this.img.src = imageUrl;
                } else {
                    this.img.src = './img/img_broken.svg';
                }
            }
        };

        this.create = function () {
            if (this.created) return;
            this.created = true;

            this.build();

            this.item.addEventListener('hover:focus', () => {
                if (this.onFocus) this.onFocus(this.item, data);
            });

            this.item.addEventListener('hover:enter', () => {
                openAnimeInTMDB(data);
            });
        };

        this.destroy = function () {
            if (this.img) {
                this.img.onerror = null;
                this.img.onload = null;
                this.img.src = '';
            }
            if (this.item) {
                this.item.remove();
            }
        };

        this.render = function (js) {
            if (!this.created) this.create();
            return js ? this.item : $(this.item);
        };
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

            // Роблю затримку між запитами, щоб Jikan API не видавав помилку 429
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
                                total_pages: res.pagination?.last_visible_page || 1,
                                cardClass: function (elem, params) {
                                    return new AnimeCard(elem, params);
                                }
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
                        total_pages: res.pagination?.last_visible_page || 1,
                        cardClass: function (elem, params) {
                            return new AnimeCard(elem, params);
                        }
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

        return comp;
    }

    // Компонент перегляду всієї категорії
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

        return comp;
    }

    // Старт та реєстація плагіна
    function startPlugin() {
        window.mal_anime_plugin = true;

        let manifest = {
            type: 'anime',
            version: '1.2.0',
            name: 'MAL Anime',
            description: 'Каталог аніме з MyAnimeList (Romaji)',
            component: 'mal_anime_main',
        };

        Lampa.Manifest.plugins = manifest;

        // Шаблони
        Lampa.Template.add('mal_anime_card', `
            <div class="card selector layer--visible layer--render">
                <div class="card__view">
                    <img class="card__img" src="./img/img_load.svg" />
                    <div class="card__type"></div>
                    <div class="card__vote"></div>
                </div>
                <div class="card__title"></div>
            </div>
        `);

        Lampa.Template.add('mal_anime_style', `
            <style>
                .card__type {
                    position: absolute;
                    top: 0.4em;
                    left: 0.4em;
                    background: #e50914;
                    color: #fff;
                    font-size: 0.7em;
                    font-weight: bold;
                    padding: 0.1em 0.4em;
                    border-radius: 0.2em;
                    text-transform: uppercase;
                    z-index: 2;
                }
            </style>
        `);

        $('body').append(Lampa.Template.get('mal_anime_style', {}, true));

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
