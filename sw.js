/* =========================================================
   Escola Estadual Professor Abel Freire Coelho
   Service Worker — cache offline da página institucional
   ========================================================= */

const VERSION = 'v1.0.0';
const CACHE_NAME = `abel-coelho-${VERSION}`;

const PRECACHE_URLS = [
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/app.js',
  './icons/favicon.svg',
  './icons/favicon-64.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

/**
 * Estratégia:
 *  - navegações  -> rede primeiro, com fallback para o cache e depois offline.html
 *  - estáticos    -> cache primeiro, com atualização em segundo plano (stale-while-revalidate)
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request, { ignoreSearch: true });
          return cached
            || (await caches.match('./index.html'))
            || (await caches.match('./offline.html'));
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
