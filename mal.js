(function () {
    'use strict';

    function startPlugin() {
        if (window.plugin_mal_installed) return;
        window.plugin_mal_installed = true;

        var network = new Lampa.Reguest();

        // Перетворення відповіді від Jikan API у формат карток Lampa
        function formatMALData(response) {
            var items = (response.data || []).map(function (item) {
                return {
                    id: item.mal_id,
                    title: item.title_japanese || item.title,
                    original_title: item.title_english || item.title,
                    name: item.title,
                    img: item.images && item.images.jpg ? (item.images.jpg.large_image_url || item.images.jpg.image_url) : '',
                    poster_path: item.images && item.images.jpg ? (item.images.jpg.large_image_url || item.images.jpg.image_url) : '',
                    vote_average: item.score || 0,
                    release_date: item.aired && item.aired.from ? item.aired.from.split('T')[0] : '',
                    first_air_date: item.aired && item.aired.from ? item.aired.from.split('T')[0] : '',
                    overview: item.synopsis || 'Опис відсутній.',
                    type: 'tv',
                    source: 'tmdb'
                };
            });

            return {
                page: response.pagination ? response.pagination.current_page : 1,
                total_pages: response.pagination ? response.pagination.last_visible_page : 1,
                results: items
            };
        }

        // 1. Реєструємо компонент через InteractionCategory
        Lampa.Component.add('mal_anime', function (object) {
            var comp = new Lampa.InteractionCategory(object);

            // Первинне завантаження сторінки
            comp.create = function () {
                var self = this;
                var page = object.page || 1;
                var url = 'https://api.jikan.moe/v4/top/anime?page=' + page;

                network.silent(url, function (response) {
                    if (response && response.data && response.data.length) {
                        var data = formatMALData(response);
                        self.build(data);
                    } else {
                        self.empty('Дані відсутні');
                    }
                }, function () {
                    self.empty('Помилка завантаження даних з MAL');
                });
            };

            // Автоматичне підвантаження наступних сторінок при скролі
            comp.nextPageReuest = function (object, resolve, reject) {
                var page = object.page || 1;
                var url = 'https://api.jikan.moe/v4/top/anime?page=' + page;

                network.silent(url, function (response) {
                    if (response && response.data && response.data.length) {
                        var data = formatMALData(response);
                        resolve(data);
                    } else {
                        reject();
                    }
                }, reject);
            };

            return comp;
        });

        // 2. Додаємо пункт у бокове меню Lampa
        function addMenuItem() {
            var button = $('<li class="menu__item selector">' +
                '<div class="menu__ico">' +
                    '<svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor">' +
                        '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>' +
                    '</svg>' +
                '</div>' +
                '<div class="menu__text">Аніме (MAL)</div>' +
            '</li>');

            button.on('hover:enter', function () {
                Lampa.Activity.push({
                    url: '',
                    title: 'Аніме (MAL)',
                    component: 'mal_anime',
                    page: 1
                });
            });

            $('.menu .menu__list').eq(0).append(button);
        }

        if (window.appready) addMenuItem();
        else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type == 'ready') addMenuItem();
            });
        }
    }

    if (window.appready) startPlugin();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') startPlugin();
        });
    }
})();
