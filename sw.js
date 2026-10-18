/* راصد — بيخلي التطبيق يفتح من غير نت لما يكون مرفوع على موقع (https).
   لو عدّلت أي ملف، زوّد رقم النسخة عشان الأجهزة تاخد التعديل. */
var V = "rased-v8-2";
var FILES = ["raed.html", "admin.html", "rased.css", "rased-core.js", "config.js", "presentation.html"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
/* الملفات: من النت لو متاح (عشان التعديلات توصل) وإلا من النسخة المحفوظة */
self.addEventListener("fetch", function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (u.origin !== location.origin && u.host.indexOf("fonts.g") !== 0) return;
  e.respondWith(fetch(e.request).then(function (r) {
    var copy = r.clone(); caches.open(V).then(function (c) { c.put(e.request, copy); });
    return r;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
});
