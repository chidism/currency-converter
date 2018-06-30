self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('currencyConverterCache').then(cache => {
            return cache.addAll([
                '/',
                '/currency-converter.css',
                '/currency-converter.js',
                '/homepage1.jpg',
            ]);
        }, function(error){
            console.log('service worker request failed',error)
        })
    );
}, function(error){
    console.log('service worker request fbailed',error)
});