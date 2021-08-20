
const CACHE_NAME = "moviebase_cache_v1";
var urlsToCache = [
    "/"
];

// Caches the things in our variable on installation
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Cache Opened");
            return cache.addAll([]);
        })
    )
});

// When something on the page fetches, this piece of code checks if the cache has a match
// - and in that case will display what is cached, if not, return the fetched response
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    )
});
