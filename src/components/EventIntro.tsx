'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAffiches } from '@/hooks/useAffiches'
import { parseFrenchDate } from '@/lib/date-fr'

const DURATION_MS = 10_000
const JOUR_MS = 24 * 60 * 60 * 1000

// Affiche une affiche d'événement partenaire parmi toutes celles pas encore
// passées (date du jour incluse), tirée au sort à chaque arrivée sur
// l'accueil — choix explicite de Christian (10 oct. 2026) : il préfère que
// toutes les affiches à venir s'alternent plutôt que de montrer uniquement
// la plus proche jusqu'à sa date. Une affiche dont le jour est terminé
// disparaît automatiquement du tirage — rien à faire côté site, juste tenir
// /admin/affiches à jour. S'affiche à chaque arrivée (pas de limite par
// session) — choix antérieur de Christian, toujours valable.
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
    return candidats[Math.floor(Math.random() * candidats.length)]
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
