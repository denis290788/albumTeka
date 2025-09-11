const CACHE_VERSION = "v1";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

const STATIC_ASSETS = [
    "/",
    "/manifest.webmanifest",
    "/icons/android-chrome-192x192.png",
    "/icons/android-chrome-512x512.png",
];

// Установка: кладём статику
self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)));
    self.skipWaiting();
});

// Активация: чистим старые кэши
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
                        .map((key) => caches.delete(key))
                )
            )
    );
    self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // Пропускаем служебное
    if (url.pathname.startsWith("/_next/") || url.pathname.startsWith("/api/")) {
        return;
    }

    // Cache-first для статики
    if (STATIC_ASSETS.includes(url.pathname)) {
        event.respondWith(
            caches.match(event.request).then((cached) => cached || fetch(event.request))
        );
        return;
    }

    // Network-first для HTML (навигация)
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const respClone = response.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => cache.put(event.request, respClone));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Остальное — cache-first + догрузка
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;

            return fetch(event.request).then((response) => {
                if (response && response.status === 200 && response.type === "basic") {
                    const respClone = response.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => cache.put(event.request, respClone));
                }
                return response;
            });
        })
    );
});
