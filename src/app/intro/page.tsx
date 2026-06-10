'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function IntroPage() {
  const router = useRouter()
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('intro-mode')
    return () => document.documentElement.classList.remove('intro-mode')
  }, [])

  const enterSite = useCallback(() => {
    if (leaving) return
    setLeaving(true)
    document.documentElement.classList.remove('intro-mode')
    setTimeout(() => router.push('/'), 900)
  }, [leaving, router])

  useEffect(() => {
    const t = setTimeout(enterSite, 14000)
    return () => clearTimeout(t)
  }, [enterSite])

  return (
    <div className={`intro-wrap${leaving ? ' intro-leaving' : ''}`}>
      {/* Image de fond FIFA WC 2026 */}
      <div
        className="intro-bg-img"
        style={{ backgroundImage: "url('/img/wc2026.jpeg')" }}
      />

      {/* Voile sombre */}
      <div className="intro-veil" />

      {/* Contenu central */}
      <div className="intro-content">
        <p className="intro-eyebrow">Nostalgie CI · 101.1 FM</p>

        <h1 className="intro-title">Coupe du&nbsp;Monde</h1>

        <div className="intro-badge">
          USA &nbsp;·&nbsp; Canada &nbsp;·&nbsp; Mexique
        </div>

        <p className="intro-dates">11 Juin — 19 Juillet 2026</p>

        <button className="intro-enter" onClick={enterSite}>
          Entrer sur le site
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      {/* Signature Nostalgie en bas */}
      <div className="intro-nostalgie-stamp">
        <span className="intro-stamp-name">NOSTALGIE</span>
        <span className="intro-stamp-sub">Diffuseur Officiel · Côte d&apos;Ivoire</span>
      </div>

      {/* Barre de progression (14 s) */}
      <div className="intro-progress-bar">
        <div className="intro-progress-fill" />
      </div>
    </div>
  )
}
