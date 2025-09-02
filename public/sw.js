const CACHE_NAME = "albumteka-cache-v1";
const STATIC_ASSETS = [
    "/", // главная страница
    "/manifest.webmanifest",
    "/icons/android-chrome-192x192.png",
    "/icons/android-chrome-512x512.png",
];

// Установка SW и кеширование только статики
self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
    self.skipWaiting();
});

// Активация и очистка старого кеша
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
            )
    );
    self.clients.claim();
});

// Стратегия fetch
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // Пропускаем все файлы Next.js и API
    if (url.pathname.startsWith("/_next/") || url.pathname.startsWith("/api/")) {
        return; // не кешируем и не перехватываем
    }

    // Cache-first только для нашей статики
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;

            return fetch(event.request).then((response) => {
                // Кешируем только GET-запросы и базовый тип ответа
                if (response && response.status === 200 && response.type === "basic") {
                    const respClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone));
                }
                return response;
            });
        })
    );
});
