'use client'

import { useState } from 'react'
import { TOP5, type Top5Item } from '@/data/top5'
import { usePlayerStore } from '@/lib/player-store'

const MEDALS = ['🥇', '🥈', '🥉']
const MAX = TOP5.items[0]?.passages ?? 1

function rangColor(rang: number) {
  if (rang === 1) return '#D4A843'
  if (rang === 2) return '#A8A8A8'
  if (rang === 3) return '#C47A3A'
  return 'rgba(245,240,232,0.35)'
}

export default function Top5Section() {
  const [modal, setModal] = useState<Top5Item | null>(null)
  const { isPlaying, toggle } = usePlayerStore()

  function openModal(item: Top5Item) {
    if (isPlaying) toggle()
    setModal(item)
  }

  function closeModal() {
    setModal(null)
  }

  const spotifyEmbedUrl = modal
    ? `https://open.spotify.com/embed/${modal.spotifyType}/${modal.spotifyId}?utm_source=generator&theme=0`
    : ''

  return (
    <>
      <section className="top5-section">
        <div className="page-section top5-inner">

          <div className="top5-header">
            <div>
              <p className="section-label">Nostalgie CI · 101.1 FM</p>
              <h2 className="top5-title">Top 5 de la semaine</h2>
              <p className="top5-semaine">Semaine du {TOP5.semaine}</p>
            </div>
            <p className="top5-source">Titres les plus diffusés à l&apos;antenne</p>
          </div>

          <div className="top5-list">
            {TOP5.items.map(item => {
              const pct = Math.round((item.passages / MAX) * 100)
              return (
                <div key={item.rang} className="top5-row">

                  {/* Pochette + badge */}
                  <div className="top5-cover-wrap">
                    <img
                      src={item.coverImg}
                      alt={item.titre}
                      className="top5-cover"
                      onError={e => { (e.target as HTMLImageElement).src = '/img/wc2026.jpeg' }}
                    />
                    <span className="top5-cover-badge" style={{ color: rangColor(item.rang) }}>
                      {item.rang <= 3 ? MEDALS[item.rang - 1] : item.rang}
                    </span>
                  </div>

                  {/* Infos */}
                  <div className="top5-info">
                    <p className="top5-artiste">{item.artiste}</p>
                    <p className="top5-titre">{item.titre}</p>
                    {/* Barre de progression */}
                    <div className="top5-bar-wrap">
                      <div
                        className="top5-bar-fill"
                        style={{
                          width: `${pct}%`,
                          background: rangColor(item.rang),
                        }}
                      />
                    </div>
                  </div>

                  {/* Passages */}
                  <span className="top5-passages">{item.passages}<span className="top5-pass-label"> pass.</span></span>

                  {/* Bouton écouter */}
                  <button
                    className="top5-play"
                    onClick={() => openModal(item)}
                    aria-label={`Écouter ${item.titre}`}
                  >
                    <span className="top5-play-icon">▶</span>
                    <span className="top5-play-label">Écouter</span>
                  </button>

                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* Modal Spotify */}
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
            <iframe
              src={spotifyEmbedUrl}
              width="100%"
              height={modal.spotifyType === 'album' ? '352' : '152'}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ border: 'none', borderRadius: '12px', display: 'block' }}
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
