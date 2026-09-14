const CACHE_NAME = 'bit-rewards-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests from the same origin that are not API calls
  if (
    event.request.method === 'GET' &&
    event.request.url.startsWith(self.location.origin) &&
    !event.request.url.includes('/api/')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => response)
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          return fetch(event.request);
        })
    );
  }
});
