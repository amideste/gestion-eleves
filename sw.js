/* Mode hors ligne : garde en cache la page et les bibliothèques (Excel, PDF) ; les données restent dans le navigateur */
var C = 'ceg1-v1', LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js'];
self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(function(c){ return Promise.all(['./'].concat(LIBS).map(function(u){ return c.add(u).catch(function(){}); })); }));
});
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || /firebaseio\.com/.test(u.host)) return;
  e.respondWith(fetch(r).then(function(res){
    var cp = res.clone(); caches.open(C).then(function(c){ c.put(r, cp); }); return res;
  }).catch(function(){ return caches.match(r, {ignoreSearch: true}).then(function(m){ return m || (r.mode === 'navigate' ? caches.match('./') : undefined); }); }));
});
