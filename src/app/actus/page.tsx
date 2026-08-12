'use client'

import { useState } from 'react'
import { useActus } from '@/hooks/useActus'

function toYouTubeEmbed(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (match) return `https://www.youtube.com/embed/${match[1]}?rel=0`
  return url
}

const SHARE_URL = 'https://www.nostalgie.ci/actus'

function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const text = encodeURIComponent(title)
  const url = encodeURIComponent(SHARE_URL)

  const copyLink = () => {
    navigator.clipboard.writeText(SHARE_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="share-bar">
      <span className="share-label">Partager</span>
      <a
        className="share-btn share-facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur Facebook"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        Facebook
      </a>
      <a
        className="share-btn share-x"
        href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur X"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        X
      </a>
      <a
        className="share-btn share-whatsapp"
        href={`https://wa.me/?text=${text}%20${url}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur WhatsApp"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
        WhatsApp
      </a>
      <button
        className="share-btn share-copy"
        onClick={copyLink}
        aria-label="Copier le lien"
      >
        {copied ? (
          '✓ Copié !'
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copier le lien
          </>
        )}
      </button>
    </div>
  )
}

export default function Actus() {
  const data = useActus()
  const [tab, setTab] = useState<'locale' | 'internationale' | 'events' | 'potins'>('events')
  const [selected, setSelected] = useState<(typeof data)['locale'][number] | null>(null)
  const articles = data[tab]

  return (
    <>
      <section className="page-section">
        <p className="section-label">L&apos;info qui groove</p>
        <h1 className="section-title">Actualités</h1>
        <div className="atabs">
          <button className={`atab ${tab === 'events' ? 'active' : ''}`} onClick={() => setTab('events')}>
            Events Nostalgie
          </button>
          <button className={`atab ${tab === 'potins' ? 'active' : ''}`} onClick={() => setTab('potins')}>
            Potins
          </button>
          <button className={`atab ${tab === 'locale' ? 'active' : ''}`} onClick={() => setTab('locale')}>
            Actu Locale
          </button>
          <button className={`atab ${tab === 'internationale' ? 'active' : ''}`} onClick={() => setTab('internationale')}>
            Actu Internationale
          </button>
        </div>
        <div className="ac-grid">
          {articles.map((a) => (
            <div key={a.title} className="ac-card" onClick={() => setSelected(a)} style={{ cursor: 'pointer' }}>
              <div className="ac-img">
                <img src={a.img} alt={a.title} style={a.imgPosition ? { objectPosition: a.imgPosition } : undefined} />
                <span className="ac-cat-badge">{a.cat}</span>
              </div>
              <div className="ac-body">
                <h3 className="ac-title-card">{a.title}</h3>
                <p className="ac-excerpt">{a.excerpt}</p>
                <p className="ac-date">{a.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Modal ── */}
      {selected && (
        <div className="actu-overlay" onClick={() => setSelected(null)}>
          <div className="actu-modal" onClick={(e) => e.stopPropagation()}>
            <button className="actu-close" onClick={() => setSelected(null)} aria-label="Fermer">✕</button>
            {/* Vidéo YouTube */}
            {selected.video ? (
              <div className="actu-modal-video">
                <iframe
                  src={toYouTubeEmbed(selected.video)}
                  title={selected.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="actu-modal-img" style={selected.imgPosition ? { marginTop: 0 } : undefined}>
                <img src={selected.img} alt={selected.title} />
                <span className="ac-cat-badge">{selected.cat}</span>
              </div>
            )}

            <div className="actu-modal-body">
              <p className="actu-modal-date">{selected.date}</p>
              <h2 className="actu-modal-title">{selected.title}</h2>
              <div className="actu-modal-text">
                {selected.body.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Galerie photos supplémentaires */}
              {selected.images && selected.images.length > 0 && (
                <div className="actu-modal-gallery">
                  {selected.images.map((src, i) => (
                    <img key={i} src={src} alt={`${selected.title} — photo ${i + 1}`} />
                  ))}
                </div>
              )}

              <ShareButtons title={selected.title} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
