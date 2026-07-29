(function () {
    'use me strict';

    // Функція ініціалізації плагіна
    function startPlugin() {
        if (window.plugin_mal_installed) return;
        window.plugin_mal_installed = true;

        // Додаємо пункт в головне меню Lampa
        Lampa.Component.add('mal_anime', function () {
            var self = this;
            var object = {
                title: 'Аніме (MAL)',
                url: 'https://api.jikan.moe/v4/top/anime'
            };

            this.create = function () {
                this.activity.loader(true);

                // Запит до Jikan API (MyAnimeList)
                $.ajax({
                    url: object.url,
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        if (response && response.data) {
                            var cards = self.formatCards(response.data);
                            self.buildList(cards);
                        } else {
                            self.empty();
                        }
                    },
                    error: function () {
                        Lampa.Noty.show('Помилка завантаження даних з MyAnimeList');
                        self.empty();
                    },
                    complete: function () {
                        self.activity.loader(false);
                    }
                });
            };

            // Перетворення даних MAL у формат картки Lampa
            this.formatCards = function (items) {
                return items.map(function (item) {
                    return {
                        id: item.mal_id,
                        title: item.title_japanese || item.title,
                        original_title: item.title_english || item.title,
                        name: item.title,
                        img: item.images.jpg.large_image_url || item.images.jpg.image_url,
                        background_image: item.images.jpg.large_image_url,
                        vote_average: item.score || 0,
                        release_date: item.aired && item.aired.from ? item.aired.from.split('T')[0] : '',
                        first_air_date: item.aired && item.aired.from ? item.aired.from.split('T')[0] : '',
                        overview: item.synopsis || 'Опис відсутній.',
                        type: 'tv', // Вказуємо тип для коректного пошуку онлайн-джерел в Lampa
                        source: 'tmdb'
                    };
                });
            };

            // Відображення сітки з картками
            this.buildList = function (cards) {
                var scroll = new Lampa.Scroll({ mask: true, over: true });
                var items = new Lampa.Items({ items: cards });

                items.on('click', function (card, element) {
                    // При кліку відкриваємо стандартне вікно картки Lampa для пошуку балансерів (CUB, Rezka тощо)
                    Lampa.Activity.push({
                        url: '',
                        component: 'full',
                        id: card.id,
                        method: 'anime',
                        card: card,
                        source: 'tmdb'
                    });
                });

                scroll.append(items.render());
                this.activity.append(scroll.render());
            };

            this.empty = function () {
                var empty = new Lampa.Empty();
                this.activity.append(empty.render());
            };
        });

        // Додаємо кнопку плагіна в ліве меню
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                var menu_item = $('<li class="menu__item selector" data-action="mal_anime">' +
                    '<div class="menu__ico">' +
                        '<svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor">' +
                            '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>' +
                        '</svg>' +
                    '</div>' +
                    '<div class="menu__text">Аніме (MAL)</div>' +
                '</li>');

                menu_item.on('hover:enter', function () {
                    Lampa.Activity.push({
                        title: 'Топ Аніме (MAL)',
                        component: 'mal_anime'
                    });
                });

                $('.menu .menu__list').append(menu_item);
            }
        });
    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') startPlugin();
        });
    }
})();
