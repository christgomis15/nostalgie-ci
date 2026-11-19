'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Interstitiel diaporama de l'habillage Nostalgie en Folie (affiches des
// concerts, visuels des exposants) : flèches, points, glisser du doigt sur
// mobile, flèches du clavier. Même cadre que la fenêtre NostaKids (nk-*).
export interface Affiche { img: string; titre: string; alt: string }

// Au-delà, les points prennent trop de place : seul le compteur reste
const MAX_POINTS = 12

export default function AffichesModal({ affiches, ratio, label, onClose }: {
  affiches: Affiche[]
  ratio: '4/3' | '1/1'
  label: string
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [i, setI] = useState(0)
  const touchX = useRef<number | null>(null)
  const n = affiches.length

  const prev = useCallback(() => setI(v => (v - 1 + n) % n), [n])
  const next = useCallback(() => setI(v => (v + 1) % n), [n])

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) < 40) return
    if (dx > 0) prev()
    else next()
  }

  // Seules l'affiche visible et ses voisines sont chargées
  const proche = (k: number) => k === i || k === (i + 1) % n || k === (i - 1 + n) % n

  return createPortal(
    <div className="nk-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={label}>
      <div className={`nk-box cm-box${ratio === '1/1' ? ' cm-carre' : ''}`} onClick={e => e.stopPropagation()}>
        <button ref={closeRef} className="nk-close" onClick={onClose} aria-label="Fermer">✕</button>

        <div
          className="cm-stage"
          style={{ aspectRatio: ratio }}
          onTouchStart={e => { touchX.current = e.touches[0].clientX }}
          onTouchEnd={onTouchEnd}
        >
          {affiches.map((x, k) => proche(k) && (
            <img
              key={x.img}
              src={x.img}
              alt={x.alt}
              className={`cm-img${k === i ? ' cm-on' : ''}`}
              aria-hidden={k !== i}
            />
          ))}
          <button className="cm-nav cm-prev" onClick={prev} aria-label="Précédent">‹</button>
          <button className="cm-nav cm-next" onClick={next} aria-label="Suivant">›</button>
        </div>

        <div className="cm-foot">
          <p className="cm-style" aria-live="polite">{affiches[i].titre} <span>{i + 1} / {n}</span></p>
          {n <= MAX_POINTS && (
            <div className="cm-dots">
              {affiches.map((x, k) => (
                <button
                  key={x.img}
                  className={`cm-dot${k === i ? ' cm-dot-on' : ''}`}
                  onClick={() => setI(k)}
                  aria-label={x.titre}
                  aria-current={k === i}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  , document.body)
}
