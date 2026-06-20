'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import { usePlayerStore } from '@/lib/player-store'
import NewsletterWidget from '@/components/NewsletterWidget'


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
        <div className="hero-inner">
          {/* Texte */}
          <div className="hero-c">
            <p className="hero-eye">Première Radio Commerciale Privée de Côte d&apos;Ivoire</p>
            <h1 className="hero-title">NOSTALGIE</h1>
            <p className="hero-slogan"><em>Sérieusement Décalée.</em></p>
            <p className="hero-villes">Abidjan · Bouaké · Yamoussoukro · San-Pédro · Korhogo · 101.1 FM</p>
            <div className="hero-actions">
              <button className="btn btn-or" onClick={toggle}>
                {isPlaying ? '⏸ En cours...' : '▶ Écouter en Direct'}
              </button>
              <Link href="/podcasts" className="btn btn-outline">Podcasts &amp; Replays</Link>
            </div>
          </div>

          {/* Image Crazy Morning */}
          <div className="hero-visual">
            <div className="hero-visual-glow" />
            <Image
              src="/img/em-01.jpg"
              alt="Le Crazy Morning — Nostalgie CI"
              width={480}
              height={480}
              className="hero-visual-img"
              priority
            />
            <div className="hero-visual-badge">
              <span className="hero-visual-dot" />
              Émission phare · 06h–10h
            </div>
          </div>
        </div>
      </section>

      <NewsletterWidget />
    </>
  )
}
