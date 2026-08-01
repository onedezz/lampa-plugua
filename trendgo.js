(function () {
    'use me strict';

    function initHlsFix() {
        // Перехоплюємо глобальний екземпляр або конфіг Hls, якщо він є
        if (typeof Hls !== 'undefined' && Hls.DefaultConfig) {
            applyFix(Hls.DefaultConfig);
        }

        // Перехоплюємо створення екземпляра Hls для динамічної зміни параметрів
        if (typeof window.Hls !== 'undefined' && !window.Hls.__fixed) {
            var OriginalHls = window.Hls;
            
            function CustomHls(config) {
                config = config || {};
                applyFix(config);
                return new OriginalHls(config);
            }

            CustomHls.prototype = OriginalHls.prototype;
            Object.keys(OriginalHls).forEach(function (key) {
                CustomHls[key] = OriginalHls[key];
            });

            CustomHls.__fixed = true;
            window.Hls = CustomHls;
        }
    }

    function applyFix(config) {
        // Збільшуємо розмір буфера (за замовчуванням 30-60 сек)
        config.maxBufferLength = 60;          // Буфер у секундах
        config.maxMaxBufferLength = 120;      // Максимальний буфер
        config.maxBufferSize = 60 * 1024 * 1024; // 60 МБ у пам'яті

        // Послаблюємо реакцію на "bufferNudgeOnStall" (зависання буфера)
        config.nudgeOffset = 0.2;            // Зсув у секундах при «підштовхуванні»
        config.nudgeMaxRetry = 10;           // Кількість спроб підштовхнути застряглий потік

        // Збільшуємо тайм-аути завантаження сегментів
        config.manifestLoadingTimeOut = 15000;
        config.levelLoadingTimeOut = 15000;
        config.fragLoadingTimeOut = 20000;

        // Повторні спроби завантажити сегмент при втраті зв'язку
        config.fragLoadingMaxRetry = 6;
        config.fragLoadingRetryDelay = 1000;
    }

    // Запуск при старті Lampa
    if (window.appready) {
        initHlsFix();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                initHlsFix();
            }
        });
    }
})();
