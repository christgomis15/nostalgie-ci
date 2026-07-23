'use client'

import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { usePlayerStore } from '@/lib/player-store'
import NewsletterWidget from '@/components/NewsletterWidget'
import { type Top5Item } from '@/data/top5'
import { useTop5 } from '@/hooks/useTop5'
import { useActus } from '@/hooks/useActus'
import { useEmissions } from '@/hooks/useEmissions'
import { sortByDateDesc } from '@/lib/date-fr'
import SpotifyPlayer, { preloadSpotify } from '@/components/SpotifyPlayer'
import WeatherWidget from '@/components/WeatherWidget'
import EmissionsSlideshow from '@/components/EmissionsSlideshow'
import { useLiveConfig } from '@/hooks/useLiveConfig'
import ChristmasSnow from '@/components/ChristmasSnow'

const MEDALS = ['🥇', '🥈', '🥉']

function rangColor(r: number) {
  if (r === 1) return '#D4A843'
  if (r === 2) return '#A8A8A8'
  if (r === 3) return '#C47A3A'
  return 'rgba(245,240,232,0.35)'
}

export default function Accueil() {
  const TOP5 = useTop5()
  const actus = useActus()
  const EMISSIONS_HOME = useEmissions()
  const { isPlaying, toggle } = usePlayerStore()
  const { isLive } = useLiveConfig()
  const ACTUS_HOME = useMemo(
    () => sortByDateDesc([...actus.locale, ...actus.internationale, ...actus.events, ...actus.potins]).slice(0, 3),
    [actus]
  )
  const [modal, setModal] = useState<Top5Item | null>(null)

  // Précharge l'API Spotify au montage pour qu'elle soit prête au 1er clic
  useEffect(() => { preloadSpotify() }, [])

  function openModal(item: Top5Item) {
    if (isPlaying) toggle()
    setModal(item)
  }

  function closeModal() {
    setModal(null)
  }

  return (
    <>
      {/* ── HERO V2 (habillage Noël) ── */}
      <section className="h2-hero xmas-hero">
        <div className="h2-hero-bg" style={{ backgroundImage: "url('/img/hero-bg.jpg')" }} />
        <div className="h2-hero-grad" />
        <div className="xmas-overlay" />
        <ChristmasSnow />

        <div className="h2-freq-coverage">
          {[
            { freq: '101.1', lines: ['ABIDJAN – BANLIEUE'] },
            { freq: '106.5', lines: ['BOUAKÉ – KATIOLA – BOTRO – BÉOUMI', 'SAKASSOU – TIÉBISSOU – PRIKRO'] },
            { freq: '92.8', lines: ['YAMOUSSOUKRO – TOUMODI – DIMBOKRO', 'BOUAFLÉ – SINFRA – ZUÉNOULA – OUMÉ – GUIBÉROUA – BONON'] },
            { freq: '97.3', lines: ['SAN-PÉDRO – SOUBRÉ – SASSANDRA – TAÏ', 'MÉAGUI – GRAND-BÉRÉBY – BUYO – LAKOTA'] },
            { freq: '98.3', lines: ['DALOA – ENVIRONS'] },
            { freq: '91.7', lines: ['KORHOGO – ENVIRONS'] },
            { freq: '87.9', lines: ['ABENGOUROU – ENVIRONS'] },
          ].map(entry => (
            <div key={entry.freq} className="h2-freq-entry">
              {entry.lines.map((line, i) => (
                <div key={i} className="h2-freq-line">
                  <span className="h2-freq-num">{i === 0 ? entry.freq : ''}</span>
                  <span className="h2-freq-text">{line}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="h2-hero-left">
          <p className="h2-eyebrow">Nostalgie CI · 101.1 FM</p>
          <p className="xmas-badge">🎄 Joyeuses Fêtes de fin d&apos;année</p>
          <img src="/img/logo-nostalgie.png" alt="Nostalgie — Sérieusement Décalée" className="h2-logo-img" />
          <div className="h2-villes-wrap">
            {[
              { freq: '101.1', ville: 'Abidjan' },
              { freq: '106.5', ville: 'Bouaké' },
              { freq: '92.8', ville: 'Yamoussoukro' },
              { freq: '97.3', ville: 'San-Pédro' },
              { freq: '98.3', ville: 'Daloa' },
              { freq: '91.7', ville: 'Korhogo' },
              { freq: '87.9', ville: 'Abengourou' },
            ].map(f => (
              <span key={f.ville} className="h2-ville-chip">
                <span className="h2-ville-freq">{f.freq}</span>
                <span className="h2-ville-nom">{f.ville}</span>
              </span>
            ))}
          </div>
          <div className="h2-actions">
            <button className="btn btn-or" onClick={toggle}>
              {isPlaying ? '⏸ En cours...' : '▶ Écouter en Direct'}
            </button>
            <Link href="/live" className={`btn btn-outline ${isLive ? 'btn-live-on' : ''}`}>
              {isLive && <span className="nav-live-dot" />}
              {isLive ? 'EN DIRECT — Regarder le Live' : '🔴 Regarder le Live'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── DIAPORAMA ÉMISSIONS ── */}
      <section className="h2-em-section">
        <EmissionsSlideshow emissions={EMISSIONS_HOME} />
      </section>

      {/* ── MÉTÉO ── */}
      <WeatherWidget />

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
            {ACTUS_HOME.map((a) => (
              <Link key={a.title} href="/actus" className="h2-actu-card">
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
