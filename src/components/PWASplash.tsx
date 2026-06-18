'use client'
import { useEffect, useState } from 'react'

export default function PWASplash() {
  const [visible, setVisible] = useState(false)
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(display-mode: standalone)').matches) return
    setVisible(true)

    const hide = setTimeout(() => {
      setHiding(true)
      setTimeout(() => setVisible(false), 600)
    }, 1800)

    return () => clearTimeout(hide)
  }, [])

  if (!visible) return null

  return (
    <div className={`pwa-splash${hiding ? ' pwa-splash-hide' : ''}`}>
      <div className="pwa-splash-card">
        <img
          src="/img/nostalgie-logo.png"
          alt="Nostalgie CI"
          className="pwa-splash-logo"
        />
      </div>
      <p className="pwa-splash-freq">101.1 FM · Abidjan</p>
      <p className="pwa-splash-tagline">Sérieusement Décalée.</p>
    </div>
  )
}
