var VERSION_NUMBER = 1;
var CACHE_NAME_PREFIX = "konferencija-cache";
var CACHE_NAME = CACHE_NAME_PREFIX + "-v" + VERSION_NUMBER;
var CACHED_URLS = [
    // Our HTML
    "/index.html",
    // Stylesheets
    "/css/konferencija.css",
    "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css",
    // JavaScript
    "https://code.jquery.com/jquery-3.0.0.min.js",
    "/js/app.js",
    "/js/offline-map.js",
    // Images
    "/img/map-offline.jpg",
    "/img/speaker-m-default.jpg",
    "/img/speaker-f-default.jpg",
    // JSON
    "/talks.json"
];

var googleMapsAPIJS = "https://maps.googleapis.com/maps/api/js?key=" +
    "AIzaSyCBAX-k6YNNSNC-BtWuwvr7CV4ACMgCTuw&callback=initMap";

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(CACHED_URLS);
        })
    );
});

self.addEventListener("fetch", function (event) {
    var requestURL = new URL(event.request.url);
    if (requestURL.pathname === "/" || requestURL.pathname === "/index.html") {
        event.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return cache.match("/index.html").then(function (cachedResponse) {
                    var fetchPromise = fetch("/index.html").then(function (networkResponse) {
                        cache.put("/index.html", networkResponse.clone());
                        return networkResponse;
                    });
                    return cachedResponse || fetchPromise;
                });
            })
        );
    } else if (requestURL.pathname === "/talks.json") {
        event.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return fetch(event.request).then(function (networkResponse) {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                }).catch(function () {
                    return caches.match(event.request);
                });
            })
        );
    } else if (requestURL.href === googleMapsAPIJS) {
        event.respondWith(
            fetch(
                googleMapsAPIJS + "&" + Date.now(),
                { mode: "no-cors", cache: "no-store" }
            ).catch(function () {
                return caches.match("/js/offline-map.js");
            })
        );
    } else if (requestURL.pathname.startsWith("/img/speaker-")) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return cache.match(event.request).then(function (cacheResponse) {
                    return cacheResponse || fetch(event.request).then(function (networkResponse) {
                        if (networkResponse.status != 200) throw "Not found";
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    }).catch(function () {
                        var defaultImage = requestURL.pathname.startsWith("/img/speaker-m") ?
                            "/img/speaker-m-default.jpg" : "/img/speaker-f-default.jpg";
                        return cache.match(defaultImage);
                    });
                });
            })
        );
    } else if (
        CACHED_URLS.includes(requestURL.href) ||
        CACHED_URLS.includes(requestURL.pathname)
    ) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    return response || fetch(event.request);
                });
            })
        );
    }
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (CACHE_NAME !== cacheName && cacheName.startsWith(CACHE_NAME_PREFIX)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});