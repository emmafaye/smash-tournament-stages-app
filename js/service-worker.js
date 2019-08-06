// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'mzs-cache-v4';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
    '../',
    '../index.html',
    '../js/script.js',
    '../js/lib/pulltorelease.js',
    '../js/lib/touch-emulator.js',
    '../css/styles.css',
    '../css/base.css',
    '../css/config-mode.css',
    '../css/portrait.css',
    '../css/print.css',
    '../stages.json',
    '../images/logo.png',
    '../EmojiSymbols.woff',
    
    '../images/stages/finaldestination.jpg',
    '../images/stages/yoshisisland.jpg',
    '../images/stages/yoshisstory.jpg',
    '../images/stages/smashville.jpg',
    '../images/stages/townandcity.jpg',
    '../images/stages/kalos.jpg',
    '../images/stages/lylatcruise.jpg',
    '../images/stages/mementos.jpg',
    '../images/stages/midgar.jpg',
    '../images/stages/pokemonstadium2.jpg',
    '../images/stages/wilycastle.jpg',
    '../images/stages/unovapokemonleague.jpg',
    '../images/stages/fountainofdreams.jpg'
];

self.addEventListener('install', (evt) => {
    // console.log('[ServiceWorker] Install');
    // CODELAB: Precache static resources here.
    evt.waitUntil(caches.open(CACHE_NAME).then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
    }));

    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    // console.log('[ServiceWorker] Activate');
    // CODELAB: Remove previous cached data from disk.
    evt.waitUntil(caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
            if (key !== CACHE_NAME) {
                // console.log('[ServiceWorker] Removing old cache', key);
                return caches.delete(key);
            }
        }));
    }));

  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    // console.log('[ServiceWorker] Fetch', evt.request.url);
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

