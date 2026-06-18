'use client'
import { useEffect, useState } from 'react'

type Mode = 'android' | 'ios' | null

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<any>(null)
  const [mode, setMode] = useState<Mode>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (localStorage.getItem('pwa-dismissed') === '1') return

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)

    if (isIOS) {
      setMode('ios')
      setTimeout(() => setVisible(true), 3000)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e)
      setMode('android')
      setTimeout(() => setVisible(true), 2000)
    }
    window.addEventListener('beforeinstallprompt', handler as EventListener)
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener)
  }, [])

  async function install() {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') dismiss()
  }

  function dismiss() {
    setVisible(false)
    localStorage.setItem('pwa-dismissed', '1')
  }

  if (!visible || !mode) return null

  return (
    <div className="pwa-banner">
      <div className="pwa-banner-icon">N</div>
      <div className="pwa-banner-text">
        <strong>Nostalgie CI</strong>
        {mode === 'android'
          ? <span>Installez l&apos;app sur votre téléphone</span>
          : <span>Safari → Partager → &laquo;&nbsp;Sur l&apos;écran d&apos;accueil&nbsp;&raquo;</span>
        }
      </div>
      {mode === 'android' && (
        <button className="pwa-banner-btn" onClick={install}>Installer</button>
      )}
      <button className="pwa-banner-close" onClick={dismiss} aria-label="Fermer">✕</button>
    </div>
  )
}
