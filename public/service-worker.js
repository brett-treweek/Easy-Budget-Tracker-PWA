const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "/db.js",
  "/styles.css",
  "/service-worker.js",
  "/manifest.webmanifest"
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(RUNTIME)
      .then((cache) => cache.addAll("/api/transaction"))
  );
  event.waitUntil(
    caches
    .open(PRECACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  )
});

self.addEventListener("activate", (event) => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith(self.location.origin) || event.request.method !== 'GET') {
    event.respondWith(fetch(event.request))
    return;}

  if (event.request.url.includes('/api/transaction')) {
    event.respondWith(
      caches.open(RUNTIME).then((cache) => {
          return fetch(event.request)
            .then((response) => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
  })


      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

      })})}))}})