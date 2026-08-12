'use client'

import { useState, useRef } from 'react'
import { usePodcasts } from '@/hooks/usePodcasts'
import { usePodcastEmissionOptions } from '@/hooks/usePodcastEmissions'
import { type ContentItem } from '@/data/replay-content'
import { usePlayerStore } from '@/lib/player-store'
import VideoInteractions from '@/components/VideoInteractions'

type Tab = 'podcasts' | 'audio' | 'video'

const TABS: { key: Tab; label: string; icon: string; vide: string }[] = [
  { key: 'podcasts', label: 'Podcasts',     icon: '🎙️', vide: 'Aucun podcast disponible pour le moment.' },
  { key: 'audio',   label: 'Replay Audio',  icon: '🎧', vide: 'Aucun replay audio disponible pour le moment.' },
  { key: 'video',   label: 'Replay Vidéo',  icon: '📺', vide: 'Aucun replay vidéo disponible pour le moment.' },
]

function ytThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
}

export default function PodcastsClient() {
  const data = usePodcasts()
  const emissionOptions = usePodcastEmissionOptions()
  const EMISSIONS_FILTER = ['Tous', ...emissionOptions]
  const [tab, setTab] = useState<Tab>('podcasts')
  const [emFilter, setEmFilter] = useState('Tous')
  const [modal, setModal] = useState<ContentItem | null>(null)
  const [radioWasPlaying, setRadioWasPlaying] = useState(false)
  const { isPlaying, toggle } = usePlayerStore()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const allItems = tab === 'podcasts' ? data.podcasts : tab === 'audio' ? data.audio : data.video
  const items = emFilter === 'Tous' ? allItems : allItems.filter(i => i.emission === emFilter)
  const currentTab = TABS.find(t => t.key === tab)!

  function switchTab(t: Tab) {
    setTab(t)
    setEmFilter('Tous')
  }

  function openModal(item: ContentItem) {
    if (isPlaying) {
      toggle()
      setRadioWasPlaying(true)
    }
    setModal(item)
  }

  function closeModal() {
    if (iframeRef.current) iframeRef.current.src = ''
    setModal(null)
    if (radioWasPlaying) {
      toggle()
      setRadioWasPlaying(false)
    }
  }

  return (
    <>
      <section className="page-section">
        <p className="section-label">À la demande</p>
        <h1 className="section-title">Podcasts &amp; Replays</h1>

        {/* Onglets */}
        <div className="pr-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`pr-tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => switchTab(t.key)}
            >
              <span className="pr-tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Filtre par émission — toujours dans le DOM pour éviter le décalage de layout */}
        <div className="pr-em-filters" style={{ visibility: tab === 'podcasts' ? 'hidden' : 'visible' }}>
          {EMISSIONS_FILTER.map(em => (
            <button
              key={em}
              className={`pr-em-filter ${emFilter === em ? 'active' : ''}`}
              onClick={() => setEmFilter(em)}
            >
              {em}
            </button>
          ))}
        </div>

        {/* Grille de contenu */}
        {items.length === 0 ? (
          <p className="pr-vide">{currentTab.vide}</p>
        ) : (
          <div className="pr-grid">
            {items.map(item => (
              <div
                key={item.id}
                className="pr-card"
                onClick={() => openModal(item)}
              >
                {/* Miniature YouTube */}
                <div className="pr-thumb">
                  <img
                    src={ytThumb(item.youtubeId)}
                    alt={item.titre}
                    loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).src = '/img/wc2026.jpeg' }}
                  />
                  <div className="pr-play">
                    {tab === 'video' ? '▶' : '🎧'}
                  </div>
                  {item.duree && <span className="pr-duree">{item.duree}</span>}
                </div>

                {/* Infos */}
                <div className="pr-info">
                  <p className="pr-emission">{item.emission}</p>
                  <p className="pr-titre">{item.titre}</p>
                  <p className="pr-date">{item.date}</p>
                  {item.description && (
                    <p className="pr-desc">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal lecteur YouTube */}
      {modal && (
        <div className="actu-overlay" onClick={() => closeModal()}>
          <div className="pr-modal" onClick={e => e.stopPropagation()}>
            <button className="actu-close" onClick={() => closeModal()} aria-label="Fermer">✕</button>
            <div className="pr-modal-meta">
              <span className="pr-emission">{modal.emission}</span>
              <span className="pr-modal-sep">·</span>
              <span className="pr-date">{modal.date}</span>
              {modal.duree && <><span className="pr-modal-sep">·</span><span className="pr-date">{modal.duree}</span></>}
            </div>
            <h3 className="pr-modal-titre">{modal.titre}</h3>
            {modal.description && <p className="pr-modal-desc">{modal.description}</p>}
            <div className="pr-player">
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${modal.youtubeId}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                style={{ border: 'none', width: '100%', height: '100%' }}
              />
            </div>
            <VideoInteractions videoId={modal.youtubeId} />
          </div>
        </div>
      )}
    </>
  )
}
