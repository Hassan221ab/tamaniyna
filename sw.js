const CACHE_NAME = 'tumanina-offline-v2';
const assetsToCache = [
  './index.html',
  './style.css',
  './main.js'
];

// تثبيت التطبيق وحفظ الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

// تفعيل الخدمة وحذف النسخ القديمة إن وجدت
self.addEventListener('activate', (event) => {
  event.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
    );
  });
});

// استراتيجية جلب الملفات: البحث في الذاكرة أولاً، وإذا لم تكن موجودة جلبها من الإنترنت وحفظها
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // إذا كان الملف مخزناً مسبقاً (تعمل بدون إنترنت)، أعطه للمستخدم مباشرة
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // وإذا لم يكن مخزناً، جلبه من الإنترنت واحفظه للمستقبل
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // في حال انقطع الإنترنت ولم يكن الملف موجوداً في الذاكرة
        if (event.request.destination === 'audio') {
          return new Response('الصوت غير متوفر حالياً بدون إنترنت.');
        }
      });
    })
  );
});