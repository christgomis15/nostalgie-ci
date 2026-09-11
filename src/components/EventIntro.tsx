'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAffiches } from '@/hooks/useAffiches'
import { parseFrenchDate } from '@/lib/date-fr'

const DURATION_MS = 10_000
const JOUR_MS = 24 * 60 * 60 * 1000

// Affiche l'affiche d'événement partenaire dont la date est la plus proche
// et pas encore passée. Dès que le jour de l'événement est terminé,
// l'affiche suivante (par date) prend le relais automatiquement — rien à
// faire côté site, juste tenir /admin/affiches à jour. S'affiche à chaque
// arrivée sur l'accueil (pas de limite par session) — choix explicite de
// Christian. Si plusieurs événements tombent exactement le même jour, on
// tire au sort celui à montrer à chaque arrivée, pour répartir l'exposition
// entre eux plutôt que de n'en montrer qu'un seul jusqu'à ce que sa date passe.
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
      // Dédoublonne par titre (une même affiche publiée deux fois par erreur
      // ne doit pas être tirée au sort deux fois plus souvent).
      .filter((a, i, arr) => arr.findIndex(x => x.titre.trim().toLowerCase() === a.titre.trim().toLowerCase()) === i)

    if (candidats.length === 0) return null
    const minTs = Math.min(...candidats.map(a => a.ts))
    const prochains = candidats.filter(a => a.ts === minTs)
    return prochains[Math.floor(Math.random() * prochains.length)]
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
