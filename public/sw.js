const CACHE = "melody-masters-shell-v12";
const APP_SHELL = ["/", "/app.css", "/app.js", "/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (new URL(event.request.url).origin !== self.location.origin || event.request.method !== "GET") return;
  if (new URL(event.request.url).pathname.startsWith("/api/")) return;
  event.respondWith(
    fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      return new Response("Connexion Internet requise pour jouer.", {
        status: 503,
        headers: { "content-type": "text/plain; charset=utf-8" }
      });
    })
  );
});
