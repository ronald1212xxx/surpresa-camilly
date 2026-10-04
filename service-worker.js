const CACHE_NAME = "surpresa-camilly-v1";
const APP_FILES = [
  "./surpresa_camilly.html",
  "./manifest.webmanifest",
  "./icons/app-icon-192.png",
  "./icons/app-icon-512.png",
  "./icons/apple-touch-icon.png",
  "./fotos_camilly/foto-01.jpg",
  "./fotos_camilly/foto-02.jpg",
  "./fotos_camilly/foto-03.jpg",
  "./fotos_camilly/foto-04.jpg",
  "./fotos_camilly/foto-05.jpg",
  "./fotos_camilly/foto-06.jpg",
  "./fotos_camilly/foto-07.jpg",
  "./fotos_camilly/foto-08.jpg",
  "./fotos_camilly/foto-09.jpg",
  "./fotos_camilly/foto-10.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || !response.ok) return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
