'use client'

import Link from 'next/link'
import { useLiveConfig } from '@/hooks/useLiveConfig'

export default function LiveClient() {
  const { isLive, videoId, title, description } = useLiveConfig()

  return (
    <div className="page-section">
      {/* En-tête */}
      <div className="live-header">
        {isLive ? (
          <span className="live-badge-on">
            <span className="live-dot" />
            EN DIRECT
          </span>
        ) : (
          <span className="live-badge-off">LIVE</span>
        )}
        <h1 className="live-title">{isLive ? title : 'Nostalgie Live'}</h1>
        {description && <p className="live-desc">{description}</p>}
      </div>

      {isLive && videoId ? (
        /* ── Player + Chat ── */
        <div className="live-layout">
          <div className="live-player-wrap">
            <iframe
              className="live-player"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="live-chat-wrap">
            <iframe
              className="live-chat"
              src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${
                process.env.NEXT_PUBLIC_DOMAIN ?? 'www.nostalgie.ci'
              }`}
              title="Chat Live"
            />
          </div>
        </div>
      ) : (
        /* ── Pas de live en ce moment ── */
        <div className="live-offline">
          <div className="live-offline-icon">📡</div>
          <h2 className="live-offline-title">Pas de live en ce moment</h2>
          <p className="live-offline-sub">
            Suivez notre chaîne YouTube pour être notifié dès que nous démarrons un live.
          </p>
          <div className="live-offline-actions">
            <a
              href="https://www.youtube.com/@nostalgiecotedivoire8471"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-or"
            >
              ▶ Voir notre chaîne YouTube
            </a>
            <Link href="/" className="btn btn-outline">
              Retour à l&apos;accueil
            </Link>
          </div>
          <p className="live-offline-hint">
            En attendant, écoutez le direct 101.1 FM via le bouton&nbsp;
            <strong>DIRECT</strong> en haut de page.
          </p>
        </div>
      )}
    </div>
  )
}
