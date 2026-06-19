'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import { usePlayerStore } from '@/lib/player-store'
import NewsletterWidget from '@/components/NewsletterWidget'

const INTRO_DURATION = 20000

const SECTIONS = [
  {
    href: '/actus',
    icon: '📰',
    label: 'Actus',
    desc: "L'actualité de Côte d'Ivoire et du monde",
    img: '/img/ac-01.jpg',
  },
  {
    href: '/emissions',
    icon: '🎙️',
    label: 'Émissions',
    desc: '11 émissions du lundi au dimanche',
    img: '/img/em-03.jpg',
  },
  {
    href: '/podcasts',
    icon: '🎧',
    label: 'Podcasts & Replay',
    desc: 'Replays audio et vidéo de vos émissions préférées',
    img: '/img/em-05.jpg',
  },
  {
    href: '/dedicaces',
    icon: '💌',
    label: 'Dédicaces',
    desc: "Envoyez un message à vos proches sur l'antenne",
    img: '/img/coulisses-animatrice.jpg',
  },
]

export default function Accueil() {
  const { isPlaying, toggle } = usePlayerStore()
  const [showIntro, setShowIntro] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
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
          <div className="intro-bg-img" style={{ backgroundImage: "url('/img/wc2026.jpeg')" }} />
          <div className="intro-veil" />
          <div className="intro-content">
            <p className="intro-eyebrow">Nostalgie CI · 101.1 FM</p>
            <h1 className="intro-title">Coupe du&nbsp;Monde</h1>
            <div className="intro-badge">USA &nbsp;·&nbsp; Canada &nbsp;·&nbsp; Mexique</div>
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
            <div className="intro-progress-fill" style={{ animationDuration: `${INTRO_DURATION / 1000}s` }} />
          </div>
        </div>
      )}

      {/* ── HERO — CRAZY MORNING À LA UNE ── */}
      <section className="hm-hero">
        {/* Halo doré derrière l'image */}
        <div className="hm-hero-glow" />

        <div className="hm-hero-inner">

          {/* Texte gauche */}
          <div className="hm-hero-text">
            <span className="hm-badge">★ &nbsp;Émission à la une</span>

            <h1 className="hm-title">
              Le Crazy<br />Morning
            </h1>

            <p className="hm-schedule">Lun – Ven &nbsp;·&nbsp; 06h → 10h</p>

            <p className="hm-crew">Arielle &nbsp;·&nbsp; Teeyah &nbsp;·&nbsp; Prince LB &nbsp;·&nbsp; Willy</p>

            <p className="hm-desc">
              Le réveil qui donne le sourire — humour, musique, actu et bonne humeur chaque matin.
            </p>

            <div className="hm-actions">
              <button className="btn btn-or hm-btn-direct" onClick={toggle}>
                <span className="hm-btn-dot" />
                {isPlaying ? 'En cours d\'écoute…' : 'Écouter en Direct'}
              </button>
              <Link href="/emissions" className="btn btn-outline">
                Voir l&apos;émission →
              </Link>
            </div>

            <p className="hm-freq">
              Nostalgie CI · 101.1 FM · Abidjan · Bouaké · Yamoussoukro
            </p>
          </div>

          {/* Image droite */}
          <div className="hm-hero-img-wrap">
            <div className="hm-hero-img-ring" />
            <Image
              src="/img/em-01.jpg"
              alt="Le Crazy Morning — Arielle, Teeyah, Prince LB, Willy"
              width={520}
              height={520}
              className="hm-hero-img"
              priority
            />
          </div>

        </div>
      </section>

      {/* ── APERÇU DU SITE ── */}
      <section className="hm-sections">
        <div className="hm-sections-grid">
          {SECTIONS.map(({ href, icon, label, desc, img }) => (
            <Link key={href} href={href} className="hm-card">
              <div className="hm-card-bg" style={{ backgroundImage: `url(${img})` }} />
              <div className="hm-card-overlay" />
              <div className="hm-card-content">
                <span className="hm-card-icon">{icon}</span>
                <strong className="hm-card-label">{label}</strong>
                <p className="hm-card-desc">{desc}</p>
                <span className="hm-card-arrow">Découvrir →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <NewsletterWidget />
    </>
  )
}
