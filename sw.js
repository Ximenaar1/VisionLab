/* VisiónLab — service worker: permite instalar la app y abrirla más rápido.
   Estrategia "primero la red": siempre intenta la versión más nueva y usa la copia guardada solo sin conexión. */
const CACHE = 'visionlab-v1.0.1';
const ARCHIVOS = ['./', './index.html', './estilos.css', './datos.js', './pixi.js', './ia.js', './app.js', './manifest.json', './icono-192.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then((r) => {
    if (r.ok && new URL(e.request.url).origin === location.origin) { const copia = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia)); }
    return r;
  }).catch(() => caches.match(e.request)));
});
