if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('Service Worker registrado con éxito:', registration.scope);
    }, function(err) {
      console.log('Error en el registro del Service Worker:', err);
    });
  });
}
