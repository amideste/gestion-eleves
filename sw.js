var C = 'ceg1-v2';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys()
      .then(function(keys){
        return Promise.all(keys.filter(function(k){ return k !== C; }).map(function(k){ return caches.delete(k); }));
      })
      .then(function(){ return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function(e){
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  if (u.origin !== location.origin && u.hostname !== 'cdnjs.cloudflare.com') return;
  e.respondWith(
    fetch(r).then(function(res){
      var cp = res.clone();
      caches.open(C).then(function(c){ c.put(r, cp); });
      return res;
    }).catch(function(){ return caches.match(r); })
  );
});
