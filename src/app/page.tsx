'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePlayerStore } from '@/lib/player-store'

const FREQUENCES = [
  { freq: '101.1', villes: 'Abidjan – Banlieue' },
  { freq: '106.5', villes: 'Bouaké – Katiola – Botro – Béoumi – Sakassou – Tiébissou – Prikro' },
  { freq: '92.8',  villes: 'Yamoussoukro – Toumodi – Dimbokro – Bouaflé – Sinfra – Zuénoula – Oumé – Guibéroua – Bonon' },
  { freq: '97.3',  villes: 'San-Pédro – Soubré – Sassandra – Taï – Méagui – Grand-Béréby – Buyo – Lakota' },
  { freq: '98.3',  villes: 'Daloa et environs' },
  { freq: '91.7',  villes: 'Korhogo et environs' },
  { freq: '87.9',  villes: 'Abengourou et environs' },
]

export default function Accueil() {
  const { isPlaying, toggle } = usePlayerStore()
  const [showIntro, setShowIntro] = useState(true)
  const [leaving, setLeaving]   = useState(false)

  const enterSite = () => {
    setLeaving(true)
    setTimeout(() => setShowIntro(false), 900)
  }

  useEffect(() => {
    const t = setTimeout(enterSite, 14000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {/* ══════════════════════════════════════
          PAGE INTRO — Coupe du Monde 2026
      ══════════════════════════════════════ */}
      {showIntro && (
        <div className={`intro-wrap ${leaving ? 'intro-leaving' : ''}`}>
          {/* Image de fond */}
          <div
            className="intro-bg-img"
            style={{ backgroundImage: "url('/img/wc2026.jpg')" }}
          />
          <div className="intro-veil" />

          {/* Contenu animé */}
          <div className="intro-content">
            <p className="intro-eyebrow">NOSTALGIE CI · DIFFUSEUR OFFICIEL</p>
            <h1 className="intro-title">
              À&nbsp;LA&nbsp;CONQUÊTE<br />DU&nbsp;MONDE
            </h1>
            <div className="intro-badge">COUPE DU MONDE DE LA FIFA 2026™</div>
            <p className="intro-dates">DU 11 JUIN &gt; 19 JUILLET</p>

            <button className="intro-enter" onClick={enterSite}>
              <span>ENTRER SUR LE SITE</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          {/* Barre de progression */}
          <div className="intro-progress-bar">
            <div className="intro-progress-fill" />
          </div>
        </div>
      )}

      {/* ── Hero ── */}
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

      {/* ── Fréquences ── */}
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
    </>
  )
}
