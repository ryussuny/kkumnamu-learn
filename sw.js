/* 꿈나무 배움터 서비스 워커 — 모든 파일을 한 번 받아 두고 인터넷 없이 쓴다.
   (scripts/build-sw.js 가 이 파일을 sw.js 로 만든다. 직접 고치지 말고 template 을 고칠 것) */
var VERSION = 'kn-1d5b8982d6';
var ASSETS = [
 "./",
 "assets/chars/astronaut.png",
 "assets/chars/detective.png",
 "assets/chars/dino.png",
 "assets/chars/fairy.png",
 "assets/chars/idol-boy.png",
 "assets/chars/idol-boy2.png",
 "assets/chars/idol-girl.png",
 "assets/chars/idol-girl2.png",
 "assets/chars/knight.png",
 "assets/chars/ninja.png",
 "assets/chars/prince.png",
 "assets/chars/princess.png",
 "assets/chars/robot.png",
 "assets/chars/wizard.png",
 "assets/icon-192.png",
 "assets/icon-512.png",
 "css/app.css",
 "index.html",
 "js/app.js",
 "js/bible-data.js",
 "js/bible-gen.js",
 "js/bible-verses.js",
 "js/brain-gen.js",
 "js/curriculum.js",
 "js/eng-data.js",
 "js/eng-gen.js",
 "js/engine.js",
 "js/kor-data.js",
 "js/kor-gen.js",
 "js/math-gen-1.js",
 "js/math-gen-2.js",
 "js/math-gen-3.js",
 "js/math-gen-4.js",
 "js/mathlib.js",
 "js/rewards.js",
 "js/store.js",
 "js/ui-brain.js",
 "js/ui-parts.js",
 "js/util.js",
 "manifest.json"
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return Promise.all(ASSETS.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (hit) {
    return hit || fetch(req).then(function (res) {
      var copy = res.clone();
      if (res.ok) caches.open(VERSION).then(function (c) { c.put(req, copy); });
      return res;
    }).catch(function () { return caches.match('index.html'); });
  }));
});
