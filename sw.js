self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('dayboard-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/script.js'
      ]);
    })
  );
});