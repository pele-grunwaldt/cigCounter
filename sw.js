// Service worker: cachea el shell para offline, pero prioriza la red para el
// HTML así las actualizaciones de la app llegan al celular sin quedar pegadas.
const CACHE = "cigcounter-v3";
const ASSETS = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // Nunca cachear las llamadas a la API de GitHub (siempre red).
  if (url.hostname === "api.github.com") return;

  // Documentos/navegación (el HTML de la app): network-first, con caché de respaldo offline.
  const isDoc = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
  if (isDoc) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match("./index.html")))
    );
    return;
  }

  // Resto de assets: cache-first.
  e.respondWith(caches.match(req).then((cached) => cached || fetch(req)));
});
