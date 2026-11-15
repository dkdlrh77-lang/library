/* 게부장 타임 — 서비스 워커 (푸시 알림 받기 전용, 화면 파일은 저장하지 않아요) 2026-11-15 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: '게부장 타임', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || '게부장 타임', {
    body: d.body || '',
    icon: 'img/icon-192.png',
    badge: 'img/icon-192.png',
    tag: d.tag || undefined,
    data: { url: d.url || 'calendar.html' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || 'calendar.html', self.registration.scope).href;
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of list) {
      if ('navigate' in c) { try { await c.focus(); await c.navigate(url); return; } catch (err) {} }
    }
    await self.clients.openWindow(url);
  })());
});
