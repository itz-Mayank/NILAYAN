// Service Worker for push notifications

const CACHE_NAME = 'ecosafety-cache-v1';
const urlsToCache = [
  '/',
  '/static/css/custom.css',
  '/static/js/main.js',
  '/static/js/charts.js',
  '/static/js/map.js',
  '/static/js/alerts.js'
];

// Install event - cache static resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Push notification event
self.addEventListener('push', event => {
  const title = 'EcoSafetyNet Alert';
  const options = {
    body: event.data ? event.data.text() : 'New disaster alert in your area',
    icon: '/static/img/alert-icon.svg',
    badge: '/static/img/alert-badge.svg',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    actions: [
      { action: 'view', title: 'View Alert' },
      { action: 'close', title: 'Close' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'view') {
    // Open the disaster map page when clicking the notification
    event.waitUntil(
      clients.openWindow('/disaster-map')
    );
  }
});
