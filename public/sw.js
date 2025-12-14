const CACHE_NAME = 'mastodon-pwa-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    // Activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    // Take control immediately
    self.clients.claim();
});

// Helper: Clear all Next.js chunk caches and notify clients to reload
async function handleStaleDeployment() {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();

    // Delete all cached _next assets
    await Promise.all(
        keys
            .filter((req) => req.url.includes('/_next/'))
            .map((req) => cache.delete(req))
    );

    // Notify all clients to reload
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((client) => {
        client.postMessage({ type: 'RELOAD_PAGE' });
    });
}

// Fetch event - network first, fall back to cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Skip API requests - always network
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    // For navigation requests (HTML pages) - network first
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache successful responses
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Fallback to cache
                    return caches.match(request).then((cached) => {
                        if (cached) return cached;
                        // Ultimate fallback to homepage
                        return caches.match('/');
                    });
                })
        );
        return;
    }

    // For Next.js chunks - network first, no stale cache fallback
    // These have content hashes and return 404 after new deployments
    if (url.pathname.startsWith('/_next/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                        return response;
                    }

                    // If chunk returns 404, deployment happened - clear stale caches
                    if (response.status === 404) {
                        handleStaleDeployment();
                    }

                    return response;
                })
                .catch(() => {
                    // Network failed - try cache but it might be stale
                    return caches.match(request);
                })
        );
        return;
    }

    // For other requests (static assets) - stale while revalidate
    event.respondWith(
        caches.match(request).then((cached) => {
            const fetchPromise = fetch(request).then((response) => {
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            });
            return cached || fetchPromise;
        })
    );
});
