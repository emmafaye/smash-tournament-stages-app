'use strict';

// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'mzs-cache-v2';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
    './',
    './index.html',
    './script.js',
    './style.css',
    './images/logo.png',
    './images/stages/battlefield.jpg',
    './images/stages/finaldestination.jpg',
    './images/stages/yoshisisland.jpg',
    './images/stages/yoshisstory.jpg',
    './images/stages/smashville.jpg',
    './images/stages/townandcity.jpg',
    './images/stages/kalos.jpg',
    './images/stages/lylatcruise.jpg',
    './images/stages/mementos.jpg',
    './images/stages/midgar.jpg',
    './images/stages/pokemonstadium2.jpg',
    './images/stages/wilycastle.jpg',
    './images/stages/unovapokemonleague.jpg',
    './images/stages/fountainofdreams.jpg'
];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');
    // CODELAB: Precache static resources here.

    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    // CODELAB: Remove previous cached data from disk.
    evt.waitUntil(
        caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
            if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
            }
        }));
        })
    );

  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);
    // CODELAB: Add fetch event handler here.
    if (evt.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
    }

    evt.respondWith(fetch(evt.request).catch(() => {
        return caches.open(CACHE_NAME).then((cache) => {
                return cache.match('index.html');
        });
    }));
});

