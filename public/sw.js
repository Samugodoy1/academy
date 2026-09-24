self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'schedule') {
    event.waitUntil(scheduleAll(event.data.notifications || []));
  }
});

async function scheduleAll(items) {
  let existing = [];
  try {
    existing = await self.registration.getNotifications({ includeTriggered: true });
  } catch (error) {
    existing = await self.registration.getNotifications();
  }
  await Promise.all(
    existing
      .filter((notification) => String(notification.tag || '').indexOf('academy-') === 0)
      .map((notification) => notification.close()),
  );

  for (const item of items) {
    if (!item || !item.title || !item.at) continue;
    const options = {
      body: item.body || '',
      tag: item.id || 'academy',
      lang: 'pt-BR',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      data: { url: item.url || '/' },
    };
    if (typeof TimestampTrigger === 'function' && item.at > Date.now()) {
      options.showTrigger = new TimestampTrigger(item.at);
      await self.registration.showNotification(item.title, options);
    }
  }
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      for (const client of windows) {
        if ('focus' in client) {
          client.navigate && client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    }),
  );
});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (error) {
    payload = { body: event.data ? event.data.text() : '' };
  }
  event.waitUntil(
    self.registration.showNotification(payload.title || 'OdontoHub Academy', {
      body: payload.body || '',
      tag: payload.tag || 'academy-push',
      lang: 'pt-BR',
      icon: '/favicon.svg',
      data: { url: payload.url || '/' },
    }),
  );
});
