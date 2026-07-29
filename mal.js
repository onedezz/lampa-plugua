(function () {
    'use strict';

    function startPlugin() {
        if (window.plugin_mal_installed) return;
        window.plugin_mal_installed = true;

        // 1. Реєструємо компонент
        Lampa.Component.add('mal_anime', function () {
            var self = this;
            var scroll, items, html;

            this.create = function () {
                var _this = this;
                
                html = $('<div></div>');
                scroll = new Lampa.Scroll({ mask: true, over: true });
                
                this.activity.loader(true);

                // Отримуємо дані з API
                $.ajax({
                    url: 'https://api.jikan.moe/v4/top/anime',
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        if (response && response.data) {
                            var cards = _this.formatCards(response.data);
                            _this.buildList(cards);
                        } else {
                            _this.empty();
                        }
                    },
                    error: function () {
                        Lampa.Noty.show('Помилка завантаження даних з MAL');
                        _this.empty();
                    },
                    complete: function () {
                        _this.activity.loader(false);
                    }
                });

                return this.render();
            };

            // Обов'язковий метод для Lampa!
            this.render = function () {
                return html;
            };

            this.formatCards = function (items) {
                return items.map(function (item) {
                    return {
                        id: item.mal_id,
                        title: item.title_japanese || item.title,
                        original_title: item.title_english || item.title,
                        name: item.title,
                        img: item.images && item.images.jpg ? item.images.jpg.large_image_url || item.images.jpg.image_url : '',
                        background_image: item.images && item.images.jpg ? item.images.jpg.large_image_url : '',
                        vote_average: item.score || 0,
                        release_date: item.aired && item.aired.from ? item.aired.from.split('T')[0] : '',
                        first_air_date: item.aired && item.aired.from ? item.aired.from.split('T')[0] : '',
                        overview: item.synopsis || 'Опис відсутній.',
                        type: 'tv',
                        source: 'tmdb'
                    };
                });
            };

            this.buildList = function (cards) {
                items = new Lampa.Items({ items: cards });

                items.on('click', function (card) {
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
                html.append(scroll.render());
            };

            this.empty = function () {
                var empty = new Lampa.Empty();
                html.append(empty.render());
            };
        });

        // 2. Додаємо пункт меню
        function addMenuItem() {
            var menu = $('.menu .menu__list');
            if (menu.length && !menu.find('[data-action="mal_anime"]').length) {
                var item = $('<li class="menu__item selector" data-action="mal_anime">' +
                    '<div class="menu__ico">' +
                        '<svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor">' +
                            '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>' +
                        '</svg>' +
                    '</div>' +
                    '<div class="menu__text">Аніме (MAL)</div>' +
                '</li>');

                item.on('hover:enter', function () {
                    Lampa.Activity.push({
                        title: 'Топ Аніме (MAL)',
                        component: 'mal_anime'
                    });
                });

                menu.append(item);
            }
        }

        addMenuItem();
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                addMenuItem();
            }
        });
    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') startPlugin();
        });
    }
})();
