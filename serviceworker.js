const CACHE_NAME = "devcoffee-v2";

const ARCHIVOS = [
    "./",
    "index.html",
    "cafe.html",
    "manifest.json",
    "CSS/style.css",
    "js/app.js",
    "images/coffee1.jpg",
    "images/coffee2.jpg",
    "images/coffee3.jpg",
    "images/coffee4.jpg",
    "images/coffee5.jpg",
    "images/coffee6.jpg",
    "images/coffee7.jpg",
    "images/coffee8.jpg",
    "images/coffee9.jpg",
    "images/coffee10.jpg",
    "images/icons/icon-72x72.png",
    "images/icons/icon-96x96.png",
    "images/icons/icon-128x128.png",
    "images/icons/icon-144x144.png",
    "images/icons/icon-152x152.png",
    "images/icons/icon-192x192.png",
    "images/icons/icon-384x384.png",
    "images/icons/icon-512x512.png"
];

self.addEventListener("install", evento => {
    evento.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ARCHIVOS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", evento => {
    evento.waitUntil(
        caches.keys()
            .then(nombres => Promise.all(
                nombres.filter(nombre => nombre !== CACHE_NAME)
                    .map(nombre => caches.delete(nombre))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", evento => {
    if (evento.request.method !== "GET") {
        return;
    }

    evento.respondWith(
        caches.match(evento.request)
            .then(respuestaCache => {
                if (respuestaCache) {
                    return respuestaCache;
                }

                return fetch(evento.request)
                    .then(respuestaRed => {
                        if (!respuestaRed || respuestaRed.status !== 200 || respuestaRed.type !== "basic") {
                            return respuestaRed;
                        }

                        const copia = respuestaRed.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(evento.request, copia));
                        return respuestaRed;
                    })
                    .catch(() => caches.match("index.html"));
            })
    );
});

