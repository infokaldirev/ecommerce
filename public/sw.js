const CACHE_NAME = 'kaldirev-cache-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './isotipo-web.svg',
  './favicon.svg',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests with HTTP/HTTPS schemes, excluding Supabase api calls or hot reloads
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http') || event.request.url.includes('/supabase/') || event.request.url.includes('socket')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Cache same-origin (basic) and cross-origin (cors) assets like Google Fonts and CDNs
        if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Fallback offline behavior
      });
    })
  );
});

// ==========================================
// WEB PUSH NOTIFICATIONS EVENT HANDLERS
// ==========================================
self.addEventListener('push', (event) => {
  let data = { 
    title: 'Kaldirev Bienestar', 
    body: '¡Novedades y ofertas exclusivas disponibles en tu tienda!', 
    icon: './isotipo-web.svg', 
    url: './' 
  };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || './isotipo-web.svg',
    badge: './isotipo-web.svg',
    vibrate: [200, 100, 200],
    data: { url: data.url || './' },
    actions: [
      { action: 'open_url', title: 'Ver en la Tienda' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Kaldirev', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || './';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
