// KrishiMitra Service Worker for Offline Functionality
const CACHE_NAME = 'krishimitra-v1.0.0'
const urlsToCache = [
    '/',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/manifest.json'
]

// Install event - cache essential files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('KrishiMitra: Opened cache')
                return cache.addAll(urlsToCache)
            })
    )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    return response
                }
                return fetch(event.request)
            })
    )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('KrishiMitra: Deleting old cache:', cacheName)
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})

// Background sync for offline data
self.addEventListener('sync', event => {
    if (event.tag === 'krishimitra-sync') {
        event.waitUntil(syncOfflineData())
    }
})

async function syncOfflineData() {
    try {
        // This would sync offline data when connection is restored
        console.log('KrishiMitra: Syncing offline data...')
        // Implementation would go here
    } catch (error) {
        console.error('KrishiMitra: Sync failed:', error)
    }
}