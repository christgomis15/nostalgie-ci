'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { usePlayerStore } from '@/lib/player-store'
import NewsletterWidget from '@/components/NewsletterWidget'
import { type Top5Item } from '@/data/top5'
import { useTop5 } from '@/hooks/useTop5'
import NostalgieTitle from '@/components/NostalgieTitle'
import SpotifyPlayer, { preloadSpotify } from '@/components/SpotifyPlayer'

const INTRO_DURATION = 20000

const MEDALS = ['🥇', '🥈', '🥉']

function rangColor(r: number) {
  if (r === 1) return '#D4A843'
  if (r === 2) return '#A8A8A8'
  if (r === 3) return '#C47A3A'
  return 'rgba(245,240,232,0.35)'
}

const ACTUS_HOME = [
  {
    cat: 'Rap Ivoire',
    img: '/img/himra.jpeg',
    title: 'Himra, premier rappeur ivoirien certifié or en France',
    date: '1 juillet 2026',
  },
  {
    cat: 'Rap Ivoire',
    img: '/img/didi-b.jpeg',
    title: 'Didi B franchit le million d\'auditeurs sur Spotify et l\'or au Nigeria',
    date: '28 juin 2026',
  },
  {
    cat: 'WC2026',
    img: '/img/christ-inao.jpg',
    title: 'Christ Inao Oulaï, si jeune et déjà indispensable',
    date: '1 juillet 2026',
  },
]

const EMISSIONS_HOME = [
  { title: 'Good Morning Holidays', tag: 'Matin', schedule: '07h – 09h', ph: '07' },
  { title: 'Le Tchika Tchika Boom', tag: 'Milieu de journée', schedule: '10h – 12h', ph: '10' },
  { title: 'Le Brand New', tag: 'Après-midi', schedule: '15h – 16h', ph: '15' },
  { title: 'My Nostalgie', tag: 'Après-midi', schedule: '16h – 18h', ph: '16' },
  { title: 'Radio Tubes', tag: 'Soirée', schedule: '18h – 20h', ph: '18' },
  { title: 'Nostalgie Holiday Mix', tag: 'Prime time', schedule: '20h – 23h', ph: '20' },
  { title: 'Nostalgie Fun Outdoor', tag: 'Week-end', schedule: 'Sam 20h – 21h', ph: '20' },
]

export default function Accueil() {
  const TOP5 = useTop5()
  const { isPlaying, toggle } = usePlayerStore()
  const [showIntro, setShowIntro] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [modal, setModal] = useState<Top5Item | null>(null)

  // Précharge l'API Spotify au montage pour qu'elle soit prête au 1er clic
  useEffect(() => { preloadSpotify() }, [])

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

  function openModal(item: Top5Item) {
    if (isPlaying) toggle()
    setModal(item)
  }

  function closeModal() {
    setModal(null)
  }

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

      {/* ── HERO V2 ── */}
      <section className="h2-hero">
        <div className="h2-hero-bg" style={{ backgroundImage: "url('/img/hero-bg.jpg')" }} />
        <div className="h2-hero-grad" />

        <div className="h2-hero-left">
          <p className="h2-eyebrow">Nostalgie CI · 101.1 FM</p>
          <NostalgieTitle />
          <p className="h2-slogan"><em>Sérieusement Décalée.</em></p>
          <div className="h2-villes-wrap">
            {['Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pédro', 'Korhogo'].map(v => (
              <span key={v} className="h2-ville-chip">{v}</span>
            ))}
          </div>
          <div className="h2-actions">
            <button className="btn btn-or" onClick={toggle}>
              {isPlaying ? '⏸ En cours...' : '▶ Écouter en Direct'}
            </button>
            <Link href="/emissions" className="btn btn-outline">Nos Émissions</Link>
          </div>
        </div>
      </section>

      {/* ── GRILLE : TOP 5 + ACTUS ── */}
      <section className="h2-content">
        <div className="h2-content-inner">

          {/* TOP 5 */}
          <div className="h2-top5">
            <p className="section-label">Antenne · Semaine du {TOP5.semaine}</p>
            <h2 className="h2-block-title">Top 5 de la semaine</h2>
            <div className="h2-t5-list">
              {TOP5.items.map(item => (
                <div key={item.rang} className="h2-t5-row">
                  {/* Pochette + badge de classement */}
                  <div className="h2-t5-cover-wrap">
                    <img
                      src={item.coverImg}
                      alt={item.titre}
                      className="h2-t5-cover"
                      onError={e => { (e.target as HTMLImageElement).src = '/img/wc2026.jpeg' }}
                    />
                    <span
                      className="h2-t5-badge"
                      style={{ color: rangColor(item.rang) }}
                    >
                      {item.rang <= 3 ? MEDALS[item.rang - 1] : `${item.rang}`}
                    </span>
                  </div>
                  <div className="h2-t5-info">
                    <p className="h2-t5-art">{item.artiste}</p>
                    <p className="h2-t5-tit">{item.titre}</p>
                  </div>
                  <span className="h2-t5-pass">{item.passages} pass.</span>
                  <button
                    className="h2-t5-play"
                    onClick={() => openModal(item)}
                    aria-label={`Écouter ${item.titre}`}
                  >
                    ▶
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ACTUS */}
          <div className="h2-actus-col">
            <p className="section-label">Toute l&apos;actualité</p>
            <h2 className="h2-block-title">Dernières actus</h2>
            {ACTUS_HOME.map((a, i) => (
              <Link key={i} href="/actus" className="h2-actu-card">
                <img
                  src={a.img}
                  alt={a.title}
                  className="h2-actu-img"
                  onError={e => { (e.target as HTMLImageElement).src = '/img/wc2026.jpeg' }}
                />
                <div>
                  <p className="h2-actu-cat">{a.cat}</p>
                  <p className="h2-actu-title">{a.title}</p>
                  <p className="h2-actu-date">{a.date}</p>
                </div>
              </Link>
            ))}
            <Link href="/actus" className="h2-actus-more">Toutes les actus →</Link>
          </div>

        </div>
      </section>

      {/* ── CARROUSEL ÉMISSIONS ── */}
      <section className="h2-em-section">
        <div className="h2-em-head">
          <div>
            <p className="section-label">Sur vos ondes</p>
            <h2 className="h2-block-title" style={{ marginBottom: 0 }}>Nos Émissions</h2>
          </div>
          <Link href="/emissions" className="h2-em-all">Toutes les émissions →</Link>
        </div>
        <div className="h2-em-scroll">
          {EMISSIONS_HOME.map(em => (
            <Link key={em.title} href="/emissions" className="h2-em-card">
              <div className="h2-em-ph">{em.ph}</div>
              <div className="h2-em-info">
                <p className="h2-em-tag">{em.tag}</p>
                <p className="h2-em-name">{em.title}</p>
                <p className="h2-em-sched">{em.schedule}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <NewsletterWidget />

      {/* ── MODAL SPOTIFY ── */}
      {modal && (
        <div className="actu-overlay" onClick={closeModal}>
          <div className="top5-modal" onClick={e => e.stopPropagation()}>
            <button className="actu-close" onClick={closeModal} aria-label="Fermer">✕</button>
            <div className="top5-modal-meta">
              <span className="top5-modal-rang" style={{ color: rangColor(modal.rang) }}>
                {modal.rang <= 3 ? MEDALS[modal.rang - 1] : `#${modal.rang}`}
              </span>
              <div>
                <p className="top5-modal-artiste">{modal.artiste}</p>
                <p className="top5-modal-titre">{modal.titre}</p>
              </div>
            </div>
            <SpotifyPlayer
              type={modal.spotifyType}
              id={modal.spotifyId}
              height={modal.spotifyType === 'album' ? 352 : 152}
            />
            <p className="top5-modal-note">
              {modal.passages} passages · Semaine du {TOP5.semaine}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
