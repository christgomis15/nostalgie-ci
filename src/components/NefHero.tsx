'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePlayerStore } from '@/lib/player-store'
import { NEF } from '@/data/nostalgie-en-folie'
import NostaKidsModal from '@/components/NostaKidsModal'

const JOUR_MS = 24 * 60 * 60 * 1000

// Compte à rebours calculé côté navigateur uniquement (évite un écart
// entre la page pré-générée au build et l'heure réelle du visiteur).
function useCountdown() {
  const [label, setLabel] = useState<string | null>(null)
  useEffect(() => {
    function tick() {
      const reste = Date.parse(NEF.debut) - Date.now()
      if (reste <= 0) setLabel('C’est maintenant !')
      else {
        const j = Math.ceil(reste / JOUR_MS)
        setLabel(j === 1 ? 'C’est demain !' : `J-${j}`)
      }
    }
    tick()
    const t = setInterval(tick, 60_000)
    return () => clearInterval(t)
  }, [])
  return label
}

export default function NefHero() {
  const { isPlaying, toggle } = usePlayerStore()
  const countdown = useCountdown()
  const [copie, setCopie] = useState(false)
  const [kids, setKids] = useState(false)
  const closeKids = useCallback(() => setKids(false), [])

  // Sur ordinateur, un lien tel: ouvre la boîte « Sélectionner une
  // application » de Windows : on copie plutôt le numéro. Sur mobile
  // (écran tactile), le lien lance l'appel normalement.
  function onTel(e: React.MouseEvent) {
    if (window.matchMedia('(pointer: coarse)').matches) return
    e.preventDefault()
    navigator.clipboard?.writeText(NEF.telephone.affiche).catch(() => {})
    setCopie(true)
    setTimeout(() => setCopie(false), 2000)
  }

  return (
    <section className="nef-hero">
      <div className="nef-bg" style={{ backgroundImage: "url('/img/nef-famille.jpg')" }} />
      <div className="nef-grad" />

      <div className="nef-inner">
        <p className="nef-eyebrow">Festival grand public</p>
        <h1 className="nef-sr">Nostalgie en Folie — 28 et 29 novembre 2026 à l&apos;INJS Marcory</h1>
        <img src="/img/nef-logo.png" alt="Nostalgie en Folie — Sponsor officiel : Port Autonome d'Abidjan" className="nef-logo" />

        <p className="nef-accroche">
          C&apos;est la folie <span>des bonnes affaires</span>
        </p>
        <p className="nef-desc">
          Pour fêter son anniversaire, Nostalgie vous donne rendez-vous pour 2 jours de festival&nbsp;:
          shopping, concerts, animations pour les enfants, santé et fitness. Venez en famille et entre amis !
        </p>

        <div className="nef-infos">
          <div className="nef-date">
            <span className="nef-ic" aria-hidden>📅</span>
            <div>
              <p className="nef-date-j">{NEF.jours.de} <span>›</span> {NEF.jours.a}</p>
              <p className="nef-date-m">{NEF.jours.mois}</p>
              <p className="nef-date-l">{NEF.jours.libelle}</p>
            </div>
          </div>
          <a href={NEF.itineraire} target="_blank" rel="noopener noreferrer" className="nef-lieu">
            <span className="nef-ic" aria-hidden>📍</span>
            <div>
              <p className="nef-lieu-n">{NEF.lieu.nom}</p>
              <p className="nef-lieu-q">{NEF.lieu.quartier}</p>
              <p className="nef-lieu-it">Itinéraire →</p>
            </div>
          </a>
          <div className="nef-badges">
            <span className="nef-gratuit">Entrée gratuite</span>
            {countdown && <span className="nef-countdown">{countdown}</span>}
          </div>
        </div>

        <ul className="nef-activites">
          {NEF.activites.map(a => a.logo ? (
            <li key={a.label} className="nef-act-li">
              <button className="nef-act nef-act-btn" onClick={() => setKids(true)} aria-label="Village Enfant : découvrir NostaKids City">
                <img src={a.logo} alt="" className="nef-act-logo-img" />
                <span className="nef-act-l">{a.label}</span>
                <span className="nef-act-voir">Découvrir ›</span>
              </button>
            </li>
          ) : (
            <li key={a.label} className="nef-act">
              <span className="nef-act-ic" aria-hidden>
                <img src={a.img} alt="" />
              </span>
              <span className="nef-act-l">{a.label}</span>
            </li>
          ))}
        </ul>

        <div className="h2-actions">
          <button className="btn btn-or" onClick={toggle}>
            {isPlaying ? '⏸ En cours...' : '▶ Écouter en Direct'}
          </button>
          <a href={NEF.telephone.lien} onClick={onTel} className="btn btn-outline nef-tel" title="Copier le numéro">
            <span>{copie ? 'Numéro copié ✓' : '📞 Exposants & annonceurs'}</span>
            <strong>{NEF.telephone.affiche}</strong>
          </a>
        </div>

        <a href={NEF.accreditation} target="_blank" rel="noopener noreferrer" className="nef-accred">
          <span className="nef-accred-ic" aria-hidden>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M9 4 7.5 6H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-2.5L15 4H9Zm3 4.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
            </svg>
          </span>
          <span className="nef-accred-t">
            <strong>Accréditations ouvertes</strong>
            <span>Demande d&apos;accréditation</span>
          </span>
          <span className="nef-accred-go" aria-hidden>→</span>
        </a>
      </div>

      <div className="nef-partenaires">
        <p className="nef-part-t">Avec nos partenaires</p>
        {/* 2e copie : sert uniquement au défilement en boucle sur mobile */}
        <div className="nef-part-track">
          <img src="/img/nef-partenaires.jpg" alt="Partenaires de Nostalgie en Folie : NCI, MACACI, CNAM, Western Union, Cody's, Pétro Ivoire, Captain, Coco Market, LG, Kaz'ann, El Paradis Cosmetic, Eburnie O" />
          <img src="/img/nef-partenaires.jpg" alt="" aria-hidden className="nef-part-dup" />
        </div>
      </div>

      {kids && <NostaKidsModal onClose={closeKids} />}
    </section>
  )
}
