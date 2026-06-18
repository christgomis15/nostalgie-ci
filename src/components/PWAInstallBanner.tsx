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

    if (!isAndroid) return // desktop : pas de bannière

    // Fallback si beforeinstallprompt ne se déclenche pas (cooldown Chrome après désinstall)
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

  return (
    <div className="pwa-banner">
      <div className="pwa-banner-icon">N</div>
      <div className="pwa-banner-text">
        <strong>Nostalgie CI</strong>
        {mode === 'android' && <span>Installez l&apos;app sur votre téléphone</span>}
        {mode === 'android-manual' && <span>Menu ⋮ → &laquo;&nbsp;Ajouter à l&apos;écran d&apos;accueil&nbsp;&raquo;</span>}
        {mode === 'ios' && <span>Partager → &laquo;&nbsp;Sur l&apos;écran d&apos;accueil&nbsp;&raquo;</span>}
      </div>
      {mode === 'android' && (
        <button className="pwa-banner-btn" onClick={install}>Installer</button>
      )}
      <button className="pwa-banner-close" onClick={dismiss} aria-label="Fermer">✕</button>
    </div>
  )
}
