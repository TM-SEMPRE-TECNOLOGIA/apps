/* TM·Zap Inspeção — Service Worker v2 */
const CACHE = 'tmzap-v2';
const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles/app.css',
  '/js/app.js',
  '/js/components/chat.js',
  '/js/components/camera.js',
  '/js/components/location.js',
  '/js/components/composer.js',
  '/js/components/export.js',
  '/js/data/itens.js',
  '/js/data/ambientes.js',
  '/js/data/sessao.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Requisições para a API backend sempre vão para a rede
  if (e.request.url.includes('/api/')) {
    e.respondWith(fetch(e.request).catch(() => new Response('{"error":"offline"}', { headers: { 'Content-Type': 'application/json' } })));
    return;
  }
  // Demais recursos: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }))
  );
});
