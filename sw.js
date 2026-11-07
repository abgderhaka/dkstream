/* DK TV: service worker minimum (tiada cache, semua permintaan terus ke rangkaian) */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
