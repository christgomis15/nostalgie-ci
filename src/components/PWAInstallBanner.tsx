'use client'
import { useEffect, useState, useRef } from 'react'

type Mode = 'android' | 'android-manual' | 'ios-safari' | 'ios-other' | null

const STORAGE_KEY = 'pwa-dismissed-v3'
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<any>(null)
  const [mode, setMode] = useState<Mode>(null)
  const [visible, setVisible] = useState(false)
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (dismissed && Date.now() - parseInt(dismissed) < DISMISS_MS) return

    const ua = navigator.userAgent
    const isIOS = /iphone|ipad|ipod/i.test(ua)
    const isAndroid = /android/i.test(ua)
    // Safari iOS : pas de CriOS (Chrome) ni FxiOS (Firefox)
    const isSafari = isIOS && !/CriOS|FxiOS|OPiOS|mercury/i.test(ua)

    if (isIOS) {
      setMode(isSafari ? 'ios-safari' : 'ios-other')
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
    localStorage.setItem(STORAGE_KEY, Date.now().toString())
  }

  if (!visible || !mode) return null

  // Sur iOS Safari : instructions étape par étape
  if (mode === 'ios-safari') {
    return (
      <div className="pwa-banner pwa-banner-ios">
        <button className="pwa-banner-close" onClick={dismiss} aria-label="Fermer">✕</button>
        <div className="pwa-ios-title">
          <div className="pwa-banner-icon">N</div>
          <strong>Installer Nostalgie CI</strong>
        </div>
        <ol className="pwa-ios-steps">
          <li>
            <span className="pwa-ios-step-icon">1</span>
            Appuyez sur <strong>Partager</strong> <span style={{fontSize:'1.1em'}}>⎋</span> en bas de Safari
          </li>
          <li>
            <span className="pwa-ios-step-icon">2</span>
            Faites défiler et choisissez <strong>«&nbsp;Sur l&apos;écran d&apos;accueil&nbsp;»</strong>
          </li>
          <li>
            <span className="pwa-ios-step-icon">3</span>
            Appuyez sur <strong>Ajouter</strong> en haut à droite
          </li>
        </ol>
      </div>
    )
  }

  // Sur Chrome iOS / autre navigateur iOS : redirection vers Safari
  if (mode === 'ios-other') {
    return (
      <div className="pwa-banner pwa-banner-ios">
        <button className="pwa-banner-close" onClick={dismiss} aria-label="Fermer">✕</button>
        <div className="pwa-ios-title">
          <div className="pwa-banner-icon">N</div>
          <strong>Installer Nostalgie CI</strong>
        </div>
        <p className="pwa-ios-subtitle">
          L&apos;installation nécessite <strong>Safari</strong>
        </p>
        <ol className="pwa-ios-steps">
          <li>
            <span className="pwa-ios-step-icon">1</span>
            Copiez ce lien : <strong>www.nostalgie.ci</strong>
          </li>
          <li>
            <span className="pwa-ios-step-icon">2</span>
            Ouvrez <strong>Safari</strong> et collez le lien
          </li>
          <li>
            <span className="pwa-ios-step-icon">3</span>
            Partager <span style={{fontSize:'1.1em'}}>⎋</span> → <strong>Sur l&apos;écran d&apos;accueil</strong>
          </li>
        </ol>
      </div>
    )
  }

  // Android
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
