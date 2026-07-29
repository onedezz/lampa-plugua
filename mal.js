(function () {
    'use strict';

    // Створюємо компонент сторінки аніме
    function JikanAnimeComponent(object) {
        var comp = this;
        var scroll = new Lampa.Scroll({mask: true, over: true});
        var body = $('<div class="category-full"></div>');
        var items = [];

        this.create = function () {
            this.activity.loader(true);

            // Запит до Jikan API v4 (Топ аніме)
            Lampa.Reguest.get('https://api.jikan.moe/v4/top/anime?limit=24', function (data) {
                comp.activity.loader(false);
                if (data && data.data && data.data.length) {
                    comp.build(data.data);
                } else {
                    comp.empty('Не вдалося завантажити список аніме');
                }
            }, function (e) {
                comp.activity.loader(false);
                comp.empty('Помилка мережі або обмеження Jikan API');
            });

            return scroll.render();
        };

        // Побудова сітки карток
        this.build = function (list) {
            scroll.append(body);

            list.forEach(function (anime) {
                // Формуємо дані для картки Lampa
                var card_data = {
                    title: anime.title_japanese || anime.title,
                    original_title: anime.title,
                    release_date: anime.year ? anime.year.toString() : (anime.aired && anime.aired.from ? anime.aired.from.substring(0, 4) : ''),
                    vote_average: anime.score || 0,
                    img: anime.images && anime.images.jpg ? anime.images.jpg.image_url : '',
                    background_image: anime.images && anime.images.jpg ? anime.images.jpg.large_image_url : ''
                };

                var card = new Lampa.Card(card_data, {
                    card_category: 'anime'
                });

                card.create();

                // При натисканні на картку — відкриваємо інформаційне модальне вікно
                card.onEnter = function () {
                    Lampa.Modal.open({
                        title: anime.title,
                        html: $(
                            '<div style="padding: 1em; line-height: 1.5;">' +
                                '<div style="display: flex; gap: 15px; margin-bottom: 15px;">' +
                                    '<img src="' + card_data.img + '" style="width: 140px; border-radius: 8px; object-fit: cover;">' +
                                    '<div>' +
                                        '<p><b>Оцінка MAL:</b> ⭐ ' + (anime.score || 'N/A') + '</p>' +
                                        '<p><b>Тип:</b> ' + (anime.type || 'TV') + '</p>' +
                                        '<p><b>Серій:</b> ' + (anime.episodes || '?') + '</p>' +
                                        '<p><b>Статус:</b> ' + (anime.status || 'N/A') + '</p>' +
                                        '<p><b>Жанри:</b> ' + (anime.genres ? anime.genres.map(function(g){ return g.name; }).join(', ') : '-') + '</p>' +
                                    '</div>' +
                                '</div>' +
                                '<div style="max-height: 200px; overflow-y: auto; font-size: 0.9em; opacity: 0.9;">' +
                                    '<p><b>Опис:</b></p>' +
                                    '<p>' + (anime.synopsis || 'Опис відсутній.') + '</p>' +
                                '</div>' +
                            '</div>'
                        ),
                        size: 'medium',
                        onBack: function () {
                            Lampa.Modal.close();
                            Lampa.Controller.toggle('content');
                        }
                    });
                };

                body.append(card.render());
                items.push(card);
            });

            this.start();
        };

        // Екран при відсутності даних або помилці
        this.empty = function (msg) {
            var empty = new Lampa.Empty({title: msg || 'Порожньо'});
            scroll.append(empty.render());
            this.start();
        };

        // Керування фокусом пульта / клавіатури
        this.start = function () {
            Lampa.Controller.add('content', {
                toggle: function () {
                    Lampa.Controller.collectionSet(scroll.render());
                    Lampa.Controller.active().focus();
                },
                left: function () {
                    Lampa.Sidebar.open();
                },
                up: function () {
                    if (navigator.up) navigator.up();
                    else Lampa.Header.focus();
                }
            });
            Lampa.Controller.toggle('content');
        };
    }

    // Реєстрація компонента
    Lampa.Component.add('jikan_anime', JikanAnimeComponent);

    // Додавання пункту в бічне меню Lampa
    function startPlugin() {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                Lampa.Menu.add({
                    title: 'Jikan Anime',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
                    component: 'jikan_anime',
                    page: 'jikan_anime'
                });
            }
        });
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') startPlugin(); });
})();
