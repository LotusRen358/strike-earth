/* ストライク・アース：オフライン用 Service Worker
   ・ゲーム本体（index.html：three.js も同梱）とアイコンを端末に保存
   ・ネットにつながるときは最新を取りに行き（取れたら保存し直す）、つながらないときは保存した版で起動
   ・オンライン対戦（PeerJS など外部への通信）は対象外（ネットが必要） */
const CACHE='strike-earth-v2.99';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
 const nav=e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('.html');
 if(nav){e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));}return r;}).catch(()=>caches.match('./index.html',{ignoreSearch:true}).then(r=>r||caches.match('./'))));return;}
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request)));});
