'use client'
import { useEffect, useState, useRef } from 'react'

type Mode = 'android' | 'android-manual' | 'ios' | null

const STORAGE_KEY = 'pwa-dismissed-v2'

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<any>(null)
  const [mode, setMode] = useState<Mode>(null)
  const [visible, setVisible] = useState(false)
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (localStorage.getItem(STORAGE_KEY) === '1') return

    const ua = navigator.userAgent
    const isIOS = /iphone|ipad|ipod/i.test(ua)
    const isAndroid = /android/i.test(ua)

    if (isIOS) {
      setMode('ios')
      setTimeout(() => setVisible(true), 3000)
      return
    }

    if (!isAndroid) return

    fallbackTimer.current = setTimeout(() => {
      setMode('android-manual')
      setVisible(true)
    }, 5000)

    const handler = (e: Event) => {
      e.preventDefault()
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current)
      setPrompt(e)
      setMode('android')
      setTimeout(() => setVisible(true), 1500)
    }
    window.addEventListener('beforeinstallprompt', handler as EventListener)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener)
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current)
    }
  }, [])

  async function install() {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') dismiss()
  }

  function dismiss() {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  if (!visible || !mode) return null

  // Bannière iOS : instructions étape par étape
  if (mode === 'ios') {
    return (
      <div className="pwa-banner pwa-banner-ios">
        <button className="pwa-banner-close" onClick={dismiss} aria-label="Fermer">✕</button>
        <div className="pwa-ios-title">
          <div className="pwa-banner-icon">N</div>
          <strong>Installer Nostalgie CI</strong>
        </div>
        <p className="pwa-ios-subtitle">Ouvrez ce site dans <strong>Safari</strong> puis :</p>
        <ol className="pwa-ios-steps">
          <li><span className="pwa-ios-step-icon">⎋</span> Appuyez sur le bouton <strong>Partager</strong></li>
          <li><span className="pwa-ios-step-icon">＋</span> Choisissez <strong>«&nbsp;Sur l&apos;écran d&apos;accueil&nbsp;»</strong></li>
          <li><span className="pwa-ios-step-icon">✓</span> Confirmez en haut à droite</li>
        </ol>
      </div>
    )
  }

  // Bannière Android
  return (
    <div className="pwa-banner">
      <div className="pwa-banner-icon">N</div>
      <div className="pwa-banner-text">
        <strong>Nostalgie CI</strong>
        {mode === 'android' && <span>Installez l&apos;app sur votre téléphone</span>}
        {mode === 'android-manual' && <span>Menu <strong>⋮</strong> → <strong>Ajouter à l&apos;écran d&apos;accueil</strong></span>}
      </div>
      {mode === 'android' && (
        <button className="pwa-banner-btn" onClick={install}>Installer</button>
      )}
      <button className="pwa-banner-close" onClick={dismiss} aria-label="Fermer">✕</button>
    </div>
  )
}
