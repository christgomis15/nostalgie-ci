'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NEF } from '@/data/nostalgie-en-folie'

// Interstitiel « Concerts » de l'habillage Nostalgie en Folie : diaporama des
// affiches (flèches, points, glisser du doigt sur mobile, flèches du clavier).
// Même cadre que la fenêtre NostaKids (classes nk-*).
const AFFICHES = NEF.concerts

export default function ConcertsModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [i, setI] = useState(0)
  const touchX = useRef<number | null>(null)
  const n = AFFICHES.length

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

  const a = AFFICHES[i]

  return createPortal(
    <div className="nk-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Concerts de Nostalgie en Folie">
      <div className="nk-box cm-box" onClick={e => e.stopPropagation()}>
        <button ref={closeRef} className="nk-close" onClick={onClose} aria-label="Fermer">✕</button>

        <div
          className="cm-stage"
          onTouchStart={e => { touchX.current = e.touches[0].clientX }}
          onTouchEnd={onTouchEnd}
        >
          {AFFICHES.map((x, k) => (
            <img
              key={x.img}
              src={x.img}
              alt={`Giga concert gratuit ${x.style} — ${x.artistes} — 28 et 29 novembre 2026, INJS Marcory`}
              className={`cm-img${k === i ? ' cm-on' : ''}`}
              aria-hidden={k !== i}
              loading={k === 0 ? 'eager' : 'lazy'}
            />
          ))}
          <button className="cm-nav cm-prev" onClick={prev} aria-label="Affiche précédente">‹</button>
          <button className="cm-nav cm-next" onClick={next} aria-label="Affiche suivante">›</button>
        </div>

        <div className="cm-foot">
          <p className="cm-style" aria-live="polite">{a.style} <span>{i + 1} / {n}</span></p>
          <div className="cm-dots">
            {AFFICHES.map((x, k) => (
              <button
                key={x.img}
                className={`cm-dot${k === i ? ' cm-dot-on' : ''}`}
                onClick={() => setI(k)}
                aria-label={`Affiche ${x.style}`}
                aria-current={k === i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  , document.body)
}
