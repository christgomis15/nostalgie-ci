'use client'
import { useEffect, useState } from 'react'

// Enregistre le service worker ET propose une mise à jour visible quand une
// nouvelle version du site est disponible (corrections, nouvelles pages…).
// Avant, la mise à jour se faisait silencieusement en arrière-plan — il
// fallait parfois fermer/rouvrir l'app deux fois pour vraiment la voir, ce
// qui donnait l'impression qu'il fallait désinstaller/réinstaller.
// Ne concerne QUE le code (JS/CSS/pages) : l'icône sur l'écran d'accueil
// reste mise en cache par le téléphone et nécessite toujours une
// réinstallation pour changer (limitation du système, pas du site).
export default function PWARegister() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)
  const [updateReady, setUpdateReady] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js').then(reg => {
      // Un SW était déjà en attente (onglet resté ouvert pendant un déploiement)
      if (reg.waiting && reg.active) {
        setWaitingWorker(reg.waiting)
        setUpdateReady(true)
      }

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (!newWorker) return
        newWorker.addEventListener('statechange', () => {
          // "installed" + un controller déjà actif = vraie mise à jour
          // (pas la toute première installation du service worker)
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker)
            setUpdateReady(true)
          }
        })
      })
    })

    let reloaded = false
    const onControllerChange = () => {
      if (reloaded) return
      reloaded = true
      window.location.reload()
    }
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)
    return () => navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
  }, [])

  function applyUpdate() {
    waitingWorker?.postMessage('SKIP_WAITING')
    setUpdateReady(false)
  }

  if (!updateReady) return null

  return (
    <div className="pwa-banner">
      <div className="pwa-banner-icon">↻</div>
      <div className="pwa-banner-text">
        <strong>Mise à jour disponible</strong>
        <span>De nouvelles corrections sont prêtes à être installées</span>
      </div>
      <button className="pwa-banner-btn" onClick={applyUpdate}>Mettre à jour</button>
    </div>
  )
}
