(function () {
    'use strict';

    function startPlugin() {
        if (window.plugin_mal_installed) return;
        window.plugin_mal_installed = true;

        // 1. Реєстрація компонента сторінки
        Lampa.Component.add('mal_anime', function (object) {
            var self = this;
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            var html = $('<div></div>');
            var body = $('<div class="category-full"><div class="category-full__body"></div></div>');

            this.create = function () {
                var _this = this;

                // Вмикаємо індикатор завантаження Lampa
                this.activity.loader(true);

                // Отримуємо дані з Jikan API (MyAnimeList)
                $.ajax({
                    url: 'https://api.jikan.moe/v4/top/anime',
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        if (response && response.data && response.data.length) {
                            _this.build(response.data);
                        } else {
                            _this.empty('Дані відсутні');
                        }
                    },
                    error: function () {
                        Lampa.Noty.show('Помилка завантаження Jikan API');
                        _this.empty('Помилка мережі');
                    },
                    complete: function () {
                        _this.activity.loader(false);
                    }
                });

                return this.render();
            };

            // Побудова сітки карток через нативний Lampa.Card
            this.build = function (items) {
                var container = body.find('.category-full__body');

                items.forEach(function (item) {
                    var card_data = {
                        id: item.mal_id,
                        title: item.title_japanese || item.title,
                        original_title: item.title_english || item.title,
                        name: item.title,
                        img: item.images && item.images.jpg ? item.images.jpg.large_image_url || item.images.jpg.image_url : '',
                        background_image: item.images && item.images.jpg ? item.images.jpg.large_image_url : '',
                        vote_average: item.score || 0,
                        release_date: item.aired && item.aired.from ? item.aired.from.split('T')[0] : '',
                        overview: item.synopsis || 'Опис відсутній.',
                        type: 'tv',
                        source: 'tmdb'
                    };

                    // Створюємо картку Lampa
                    var card = new Lampa.Card(card_data, {
                        card_category: true
                    });

                    card.create();

                    // Малювання зображення
                    card.visible = function () {
                        card.draw();
                    };

                    // Подія натискання на картку
                    card.on('hover:enter', function () {
                        Lampa.Activity.push({
                            url: '',
                            component: 'full',
                            id: card_data.id,
                            method: 'anime',
                            card: card_data,
                            source: 'tmdb'
                        });
                    });

                    container.append(card.render());
                });

                scroll.append(body);
                html.append(scroll.render());

                self.start();
            };

            this.empty = function (msg) {
                var empty = new Lampa.Empty({ title: msg || 'Порожньо' });
                scroll.append(empty.render());
                html.append(scroll.render());
                self.start();
            };

            // Керування фокусом пульта / клавіатури
            this.start = function () {
                Lampa.Controller.add('content', {
                    toggle: function () {
                        Lampa.Controller.collectionSet(scroll.render());
                        Lampa.Controller.collectionFocus(false, scroll.render());
                    },
                    left: function () {
                        Lampa.Controller.toggle('menu');
                    },
                    up: function () {
                        Lampa.Controller.toggle('head');
                    }
                });

                Lampa.Controller.toggle('content');
            };

            this.pause = function () {};

            this.destroy = function () {
                scroll.destroy();
            };

            this.render = function () {
                return html;
            };
        });

        // 2. Додавання пункту до бокового меню
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
                        title: 'Аніме (MAL)',
                        component: 'mal_anime'
                    });
                });

                menu.append(item);
            }
        }

        addMenuItem();

        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') addMenuItem();
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
