const CACHE_NAME = "devcoffee-v3";

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
                nombres
                    .filter(nombre => nombre !== CACHE_NAME)
                    .map(nombre => caches.delete(nombre))
            ))
            .then(() => self.clients.claim())
    );
});

async function cacheFirst(peticion) {
    const cache = await caches.open(CACHE_NAME);
    const guardado = await cache.match(peticion);

    if (guardado) {
        return guardado;
    }

    try {
        const respuesta = await fetch(peticion);
        if (respuesta && respuesta.ok && respuesta.type === "basic") {
            cache.put(peticion, respuesta.clone());
        }
        return respuesta;
    } catch (error) {
        const alternativa = await cache.match(peticion, { ignoreSearch: true });
        if (alternativa) {
            return alternativa;
        }
        return new Response("", { status: 504, statusText: "Sin conexion" });
    }
}

async function networkFirst(peticion) {
    const cache = await caches.open(CACHE_NAME);

    try {
        const respuesta = await fetch(peticion);
        if (respuesta && respuesta.ok && respuesta.type === "basic") {
            cache.put(peticion, respuesta.clone());
        }
        return respuesta;
    } catch (error) {
        const guardado = await cache.match(peticion, { ignoreSearch: true });
        if (guardado) {
            return guardado;
        }
        const inicio = await cache.match("index.html");
        if (inicio) {
            return inicio;
        }
        return new Response("", { status: 504, statusText: "Sin conexion" });
    }
}

function esPagina(peticion) {
    return peticion.mode === "navigate" ||
        (peticion.headers.get("accept") || "").includes("text/html");
}

self.addEventListener("fetch", evento => {
    const peticion = evento.request;

    if (peticion.method !== "GET") {
        return;
    }

    if (new URL(peticion.url).origin !== self.location.origin) {
        return;
    }

    if (esPagina(peticion)) {
        evento.respondWith(networkFirst(peticion));
    } else {
        evento.respondWith(cacheFirst(peticion));
    }
});
