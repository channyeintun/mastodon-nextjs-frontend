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

// Push notification event - handle incoming push messages from Mastodon
self.addEventListener('push', (event) => {
    if (!event.data) return;

    event.waitUntil(
        // Check if any app window is focused before showing notification
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Skip notification if app is already focused (user will see it in-app)
            const isAppFocused = clientList.some(client => client.focused);
            if (isAppFocused) {
                return;
            }

            try {
                const data = event.data.json();

                // Mastodon sends notifications in a specific format
                const options = {
                    body: data.body || data.message || 'New notification',
                    icon: data.icon || '/icons/icon-192.png',
                    badge: '/icons/icon-192.png',
                    tag: data.notification_id || data.tag || 'mastodon-notification',
                    data: {
                        url: data.url || data.notification_url || '/',
                        notification_id: data.notification_id,
                        type: data.notification_type || data.type,
                    },
                    vibrate: [100, 50, 100],
                    requireInteraction: false,
                };

                const title = data.title || 'Mastodon';

                return self.registration.showNotification(title, options);
            } catch (error) {
                // If JSON parsing fails, try to show a generic notification
                console.error('[SW] Error parsing push data:', error);
                return self.registration.showNotification('Mastodon', {
                    body: 'You have a new notification',
                    icon: '/icons/icon-192.png',
                    badge: '/icons/icon-192.png',
                });
            }
        })
    );
});

// Notification click event - handle user clicks on notifications
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const url = event.notification.data?.url || '/notifications';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Try to focus an existing window
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.focus();
                    client.navigate(url);
                    return;
                }
            }
            // If no existing window, open a new one
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

