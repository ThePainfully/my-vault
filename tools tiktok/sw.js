// Service Worker بسيط جداً للسماح بتثبيت التطبيق (PWA) بدون تعقيدات التخزين المؤقت
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    // لا نقوم بعمل كاش هنا، نتركه يجلب الفيديوهات بشكل عادي
    // هذا الملف موجود فقط لاستيفاء شروط PWA الخاصة بالمتصفح
});
