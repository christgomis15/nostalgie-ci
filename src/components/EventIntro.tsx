'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAffiches } from '@/hooks/useAffiches'
import { parseFrenchDate } from '@/lib/date-fr'

const DURATION_MS = 10_000
const JOUR_MS = 24 * 60 * 60 * 1000

// Affiche l'affiche d'événement partenaire dont la date est la plus proche
// et pas encore passée (une seule à la fois). Dès que le jour de
// l'événement est terminé, l'affiche suivante (triée par date) prend le
// relais automatiquement — rien à faire côté site, juste tenir /admin/affiches
// à jour. S'affiche à chaque arrivée sur l'accueil (pas de limite par
// session) — choix explicite de Christian.
export default function EventIntro() {
  const affiches = useAffiches()
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const active = useMemo(() => {
    const now = Date.now()
    const candidats = affiches
      .filter(a => a.img)
      .map(a => ({ ...a, ts: parseFrenchDate(a.date) }))
      .filter((a): a is typeof a & { ts: number } => a.ts !== null && a.ts + JOUR_MS > now)
      .sort((a, b) => a.ts - b.ts)
    return candidats[0] ?? null
  }, [affiches])

  useEffect(() => {
    if (active) setVisible(true)
  }, [active])

  function close() {
    if (leaving) return
    setLeaving(true)
    setTimeout(() => setVisible(false), 500)
  }

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(close, DURATION_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  // Bloque le scroll du body tant que l'affiche est visible
  useEffect(() => {
    if (!visible) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [visible])

  if (!visible || !active) return null

  return (
    <div className={`ev-intro ${leaving ? 'ev-intro-leaving' : ''}`}>
      <button className="ev-intro-skip" onClick={close} aria-label="Passer">
        Entrer sur le site ✕
      </button>
      <img className="ev-intro-img" src={active.img} alt={active.titre} />
      <div className="ev-intro-progress">
        <div className="ev-intro-progress-fill" style={{ animationDuration: `${DURATION_MS}ms` }} />
      </div>
    </div>
  )
}
