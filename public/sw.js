// Clawdbot Push Notification Service Worker
// This handles push notifications when the app is in the background

const CACHE_NAME = 'clawdbot-v1';
const APP_URL = self.location.origin;

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  let data = {
    title: 'Clawdbot',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'default',
    data: {},
  };

  // Parse push data if available
  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/badge-72x72.png',
    tag: data.tag || 'default',
    data: data.data || {},
    vibrate: [100, 50, 100],
    requireInteraction: data.data?.priority === 'urgent',
    actions: data.actions || [],
    // Show timestamp
    timestamp: Date.now(),
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  event.notification.close();

  const data = event.notification.data || {};
  let targetUrl = APP_URL;

  // Handle action clicks
  if (event.action) {
    switch (event.action) {
      case 'view':
        targetUrl = data.url || `${APP_URL}/notifications`;
        break;
      case 'dismiss':
        // Just close the notification
        return;
      default:
        targetUrl = data.url || `${APP_URL}/notifications`;
    }
  } else {
    // Default click - open notification URL or notifications page
    targetUrl = data.url || `${APP_URL}/notifications`;
  }

  // Focus existing window or open new one
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there's already a window open
      for (const client of windowClients) {
        if (client.url.startsWith(APP_URL) && 'focus' in client) {
          client.focus();
          client.navigate(targetUrl);
          return;
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Notification close event - track dismissals
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event.notification.tag);
  
  const data = event.notification.data || {};
  
  // Track dismissal (could send to analytics)
  if (data.notificationId) {
    // TODO: Send dismissal event to backend
    console.log('[SW] Notification dismissed:', data.notificationId);
  }
});

// Handle background sync for offline notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  try {
    // Fetch any pending notifications from the server
    const response = await fetch(`${APP_URL}/api/notifications/pending`);
    if (response.ok) {
      const notifications = await response.json();
      // Process any pending notifications
      console.log('[SW] Synced notifications:', notifications.length);
    }
  } catch (error) {
    console.error('[SW] Failed to sync notifications:', error);
  }
}

// Message handler for communication with main app
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    
    case 'SHOW_NOTIFICATION':
      // Allow main app to trigger notifications through service worker
      self.registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: payload.tag,
        data: payload.data,
      });
      break;

    case 'GET_SUBSCRIPTION':
      // Return current push subscription
      self.registration.pushManager.getSubscription().then((subscription) => {
        event.source.postMessage({
          type: 'SUBSCRIPTION',
          payload: subscription ? JSON.parse(JSON.stringify(subscription)) : null,
        });
      });
      break;
  }
});

console.log('[SW] Service worker loaded');
