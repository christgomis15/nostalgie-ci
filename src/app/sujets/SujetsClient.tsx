'use client'

import { useState } from 'react'
import { useSujets, type Sujet } from '@/hooks/useSujets'
import VideoInteractions from '@/components/VideoInteractions'

// Réutilise le système de J'aime / commentaires déjà construit pour les
// vidéos (onglets Likes / Commentaires du Sheet, clé libre) : chaque sujet a
// sa propre clé, dérivée de son titre — pas besoin d'un nouvel onglet.
function sujetKey(titre: string) {
  return `sujet-${titre.trim()}`
}

export default function SujetsClient() {
  const { sujets, loading } = useSujets()
  const [emFilter, setEmFilter] = useState('Tous')
  const [modal, setModal] = useState<Sujet | null>(null)

  const emissions = Array.from(
    new Set(sujets.map(s => s.emission.trim()).filter(Boolean))
  )
  const FILTERS = ['Tous', ...emissions]
  const items = emFilter === 'Tous' ? sujets : sujets.filter(s => s.emission.trim() === emFilter)

  return (
    <>
      <section className="page-section">
        <p className="section-label">Votre avis compte</p>
        <h1 className="section-title">Sujets du jour</h1>
        <p className="sj-intro">
          Chaque jour, l&apos;équipe des émissions vous propose un sujet à commenter. Réagissez
          directement ici — pas besoin de Facebook.
        </p>

        {emissions.length > 0 && (
          <div className="pr-em-filters" style={{ visibility: 'visible' }}>
            {FILTERS.map(em => (
              <button
                key={em}
                className={`pr-em-filter ${emFilter === em ? 'active' : ''}`}
                onClick={() => setEmFilter(em)}
              >
                {em}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="pr-vide">Chargement…</p>
        ) : items.length === 0 ? (
          <p className="pr-vide">Aucun sujet publié pour le moment. Revenez bientôt !</p>
        ) : (
          <div className="pr-grid">
            {items.map(s => (
              <div key={s.titre} className="pr-card" onClick={() => setModal(s)}>
                <div className="pr-thumb">
                  {s.img ? (
                    <img
                      src={s.img}
                      alt={s.titre}
                      loading="lazy"
                      onError={e => { (e.target as HTMLImageElement).style.visibility = 'hidden' }}
                    />
                  ) : (
                    <div className="sj-thumb-fallback">💬</div>
                  )}
                  <div className="pr-play">💬</div>
                </div>
                <div className="pr-info">
                  {s.emission && <p className="pr-emission">{s.emission}</p>}
                  <p className="pr-titre">{s.titre}</p>
                  <p className="pr-date">{s.date}</p>
                  {s.question && <p className="pr-desc">{s.question}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {modal && (
        <div className="actu-overlay" onClick={() => setModal(null)}>
          <div className="pr-modal" onClick={e => e.stopPropagation()}>
            <button className="actu-close" onClick={() => setModal(null)} aria-label="Fermer">✕</button>
            <div className="pr-modal-meta">
              {modal.emission && <span className="pr-emission">{modal.emission}</span>}
              {modal.emission && <span className="pr-modal-sep">·</span>}
              <span className="pr-date">{modal.date}</span>
            </div>
            <h3 className="pr-modal-titre">{modal.titre}</h3>
            {modal.img && (
              <img
                src={modal.img}
                alt={modal.titre}
                style={{ width: '100%', borderRadius: 8, marginBottom: 16, maxHeight: 320, objectFit: 'cover' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            {modal.question && <p className="pr-modal-desc">{modal.question}</p>}
            <VideoInteractions videoId={sujetKey(modal.titre)} />
          </div>
        </div>
      )}
    </>
  )
}
