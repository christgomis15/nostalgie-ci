'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { usePlayerStore } from '@/lib/player-store'
import NewsletterWidget from '@/components/NewsletterWidget'

const FREQUENCES = [
  { freq: '101.1', villes: 'Abidjan – Banlieue' },
  { freq: '106.5', villes: 'Bouaké – Katiola – Botro – Béoumi – Sakassou – Tiébissou – Prikro' },
  { freq: '92.8',  villes: 'Yamoussoukro – Toumodi – Dimbokro – Bouaflé – Sinfra – Zuénoula – Oumé – Guibéroua – Bonon' },
  { freq: '97.3',  villes: 'San-Pédro – Soubré – Sassandra – Taï – Méagui – Grand-Béréby – Buyo – Lakota' },
  { freq: '98.3',  villes: 'Daloa et environs' },
  { freq: '91.7',  villes: 'Korhogo et environs' },
  { freq: '87.9',  villes: 'Abengourou et environs' },
]

const INTRO_DURATION = 20000

export default function Accueil() {
  const { isPlaying, toggle } = usePlayerStore()
  const [showIntro, setShowIntro] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    // Intro une seule fois par session
    if (!sessionStorage.getItem('intro-seen')) {
      setShowIntro(true)
      document.documentElement.classList.add('intro-mode')
    }
    return () => document.documentElement.classList.remove('intro-mode')
  }, [])

  const enterSite = useCallback(() => {
    if (leaving) return
    setLeaving(true)
    sessionStorage.setItem('intro-seen', '1')
    // On retire intro-mode dès maintenant : header/player se préparent sous le fondu
    document.documentElement.classList.remove('intro-mode')
    setTimeout(() => setShowIntro(false), 950)
  }, [leaving])

  useEffect(() => {
    if (!showIntro) return
    const t = setTimeout(enterSite, INTRO_DURATION)
    return () => clearTimeout(t)
  }, [showIntro, enterSite])

  return (
    <>
      {/* ── INTRO COUPE DU MONDE ── */}
      {showIntro && (
        <div className={`intro-wrap${leaving ? ' intro-leaving' : ''}`}>
          <div
            className="intro-bg-img"
            style={{ backgroundImage: "url('/img/wc2026.jpeg')" }}
          />
          <div className="intro-veil" />

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
                stroke="currentColor" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <div className="intro-nostalgie-stamp">
            <span className="intro-stamp-name">NOSTALGIE</span>
            <span className="intro-stamp-sub">Diffuseur Officiel · Côte d&apos;Ivoire</span>
          </div>

          <div className="intro-progress-bar">
            <div
              className="intro-progress-fill"
              style={{ animationDuration: `${INTRO_DURATION / 1000}s` }}
            />
          </div>
        </div>
      )}

      {/* ── PAGE D'ACCUEIL ── */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: "url('/img/hero-bg.jpg')" }} />
        <div className="hero-grad" />
        <div className="page-section hero-c">
          <p className="hero-eye">Première Radio Commerciale Privée de Côte d&apos;Ivoire</p>
          <h1 className="hero-title">NOSTALGIE</h1>
          <p className="hero-slogan"><em>Sérieusement Décalée.</em></p>
          <p className="hero-villes">Abidjan · Bouaké · Yamoussoukro · San-Pédro · Korhogo · 101.1 FM</p>
          <div className="hero-actions">
            <button className="btn btn-or" onClick={toggle}>
              {isPlaying ? '⏸ En cours...' : '▶ Écouter en Direct'}
            </button>
            <Link href="/podcasts" className="btn btn-outline">Nos Podcasts</Link>
          </div>
        </div>
      </section>

      <div className="freq-footer">
        <div className="freq-footer-inner">
          <p className="freq-footer-title">Fréquences en Côte d&apos;Ivoire</p>
          <div className="freq-list">
            {FREQUENCES.map((f) => (
              <div key={f.freq} className="freq-row">
                <span className="freq-number">{f.freq}</span>
                <span className="freq-fm-tag">FM</span>
                <span className="freq-cities">{f.villes}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NewsletterWidget />
    </>
  )
}
