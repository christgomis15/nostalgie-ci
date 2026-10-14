const CACHE = 'nostalgie-ci-v3'
const PRECACHE = ['/', '/live', '/emissions', '/podcasts', '/dedicaces', '/actus', '/contact']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)))
  // Pas de skipWaiting() automatique ici : le nouveau service worker reste
  // "en attente" jusqu'à ce que la page le lui demande explicitement
  // (bouton "Mettre à jour" affiché par PWARegister.tsx). Avant, la bascule
  // se faisait silencieusement en arrière-plan, sans que l'auditeur en ait
  // conscience — d'où l'impression qu'il fallait désinstaller/réinstaller
  // l'app pour voir les corrections.
})

self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('/')))
  }
})
