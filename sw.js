// Instalar el service worker
self.addEventListener('install', function(event) {
    console.log('Service Worker: Instalado');
});

// Activar el service worker
self.addEventListener('activate', function(event) {
    console.log('Service Worker: Activado');
});

// Manejar fetch requests
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request);
        })
    );
});
