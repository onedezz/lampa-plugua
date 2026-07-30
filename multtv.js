(function () {
    'use strict';

    /**
     * REAL EXTERNAL API ANIMATED TV SHOWS (Powered by TVMaze)
     */

    var API_CONFIG = {
        title: 'Мультсеріали (TVMaze API)',
        icon: '<svg viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/><path d="M9.5 7.5v7l5.5-3.5z" fill="#ffffff"/></svg>'
    };

    function mapTvMazeToLampa(item) {
        return {
            id: item.id,
            imdb_id: item.externals ? item.externals.imdb : null, // Завдяки IMDb ID балансери Lampa знайдуть відео!
            name: item.name,
            original_name: item.name,
            overview: item.summary ? item.summary.replace(/<[^>]*>?/gm, '') : '',
            poster_path: item.image ? item.image.original || item.image.medium : null,
            vote_average: item.rating && item.rating.average ? item.rating.average : 0,
            first_air_date: item.premiered || '',
            method: 'tv'
        };
    }

    function TvMazeAnimatedTvMain(object) {
        var comp = new Lampa.InteractionMain(object);

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var network = new Lampa.Reguest();

            // Справжнє працююче API TVMaze
            var url = 'https://api.tvmaze.com/shows?page=1';

            network.silent(url, function (shows) {
                if (Array.isArray(shows)) {
                    // Фільтруємо лише анімаційні серіали (Animation)
                    var animated = shows.filter(function (show) {
                        return show.genres && show.genres.indexOf('Animation') !== -1 && show.image;
                    }).map(mapTvMazeToLampa);

                    Lampa.Utils.extendItemsParams(animated, { style: { name: 'wide' } });

                    _this.build([{
                        title: '🔥 Популярні мультсеріали (з TVMaze)',
                        results: animated
                    }]);
                    _this.activity.loader(false);
                } else {
                    _this.empty();
                }
            }, function () {
                _this.empty();
            });

            return this.render();
        };

        // При кліці відкриваємо картку
        comp.onItemSelect = function (item) {
            Lampa.Activity.push({
                component: 'full',
                id: item.id,
                imdb_id: item.imdb_id,
                method: 'tv',
                card: item
            });
        };

        return comp;
    }

    function startPlugin() {
        if (window.plugin_tvmaze_anim_ready) return;
        window.plugin_tvmaze_anim_ready = true;

        Lampa.Component.add('tvmaze_anim_main', TvMazeAnimatedTvMain);

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.menu__item[data-action="tvmaze_anim"]').length) return;

            var btn = $(`<li class="menu__item selector" data-action="tvmaze_anim">
                <div class="menu__ico">${API_CONFIG.icon}</div>
                <div class="menu__text">${API_CONFIG.title}</div>
            </li>`);

            btn.on('hover:enter', function () {
                Lampa.Activity.push({
                    title: API_CONFIG.title,
                    component: 'tvmaze_anim_main',
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

    if (!window.plugin_tvmaze_anim_ready) startPlugin();
})();
