'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Visuel NostaKids City (fichier graphiste validé le 09/11/2026), recomposé en
// calques pour l'animer : fond (photo + textes), cape détourée, coffre,
// cadeaux et reflet sur le logo. Coordonnées en points PDF, zone utile
// 1134 × 850.4 (fond perdu retiré) — ne pas modifier sans re-mesurer.
const W = 1134
const H = 850.4
const IMG = '/img/nostakids/'

// Coffre et cadeaux : exportés tels que le PDF les dessine (déjà tournés),
// donc simples rectangles. Le logo garde sa légère rotation d'origine.
function place(left: number, top: number, w: number, h: number, rot = 0): React.CSSProperties {
  return {
    left: `${(left / W) * 100}%`,
    top: `${(top / H) * 100}%`,
    width: `${(w / W) * 100}%`,
    height: `${(h / H) * 100}%`,
    ...(rot ? { rotate: `${rot}deg` } : {}),
  }
}

const COFFRE = place(87.5, 146, 51.5, 50.5)
// Les cadeaux passent derrière la vague blanche du bas : ils sont placés dans
// une zone fixe masquée par la forme de la vague (masque-vague.png), relevée
// sur le fichier source.
const VAGUE = { x: 790, y: 500, w: 344, h: 350.4 }
const ZONE_VAGUE = place(VAGUE.x, VAGUE.y, VAGUE.w, VAGUE.h)
function dansVague(left: number, top: number, w: number, h: number): React.CSSProperties {
  return {
    left: `${((left - VAGUE.x) / VAGUE.w) * 100}%`,
    top: `${((top - VAGUE.y) / VAGUE.h) * 100}%`,
    width: `${(w / VAGUE.w) * 100}%`,
    height: `${(h / VAGUE.h) * 100}%`,
  }
}
const CADEAU_1 = dansVague(795, 641, 117.5, 122)
const CADEAU_2 = dansVague(895, 578, 192.5, 207)
const LOGO = place(421.33 - 433.85 / 2, 98.72 - 243.64 / 2, 433.85, 243.64, -0.26)
const CAPE = place(897, 167, 237, 390)

export default function NostaKidsModal({ onClose }: { onClose: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [stageW, setStageW] = useState(1000)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // L'ondulation de la cape est réglée en pixels : on l'ajuste à la taille
  // réelle du visuel pour garder le même effet sur mobile et sur ordinateur.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setStageW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const f = 1 / (stageW * 0.07)
  const freqs = `${f} ${f * 2.2};${f * 1.25} ${f * 2.6};${f} ${f * 2.2}`

  // Rendu directement dans <body> pour passer au-dessus du menu et du lecteur radio
  return createPortal(
    <div className="nk-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="NostaKids City — Village Enfant">
      <div className="nk-box" onClick={e => e.stopPropagation()}>
        <button ref={closeRef} className="nk-close" onClick={onClose} aria-label="Fermer">✕</button>

        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
          <filter id="nk-wave" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency={`${f} ${f * 2.2}`} numOctaves={2} seed={4} result="n">
              <animate attributeName="baseFrequency" dur="6s" values={freqs} repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="n" scale={stageW * 0.012} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        <div ref={stageRef} className="nk-stage">
          <img className="nk-fond" src={`${IMG}fond.webp`} alt="NostaKids City x Nostalgie en Folie : amuse-toi, relève les défis et gagne ! Les 28 et 29 novembre 2026 à l'INJS Marcory, de 10h à 18h." />
          <img className="nk-layer nk-cape" src={`${IMG}cape.webp`} alt="" style={CAPE} />
          <span className="nk-layer nk-shine" style={LOGO} aria-hidden />
          <div className="nk-layer nk-vague" style={ZONE_VAGUE}>
            <img className="nk-layer nk-cadeau nk-cadeau-1" src={`${IMG}cadeau-1.webp`} alt="" style={CADEAU_1} />
            <img className="nk-layer nk-cadeau nk-cadeau-2" src={`${IMG}cadeau-2.webp`} alt="" style={CADEAU_2} />
          </div>
          <div className="nk-layer nk-coffre" style={COFFRE}>
            <img src={`${IMG}coffre.webp`} alt="" />
            {[0, 1, 2, 3, 4, 5].map(i => <span key={i} className={`nk-spark nk-spark-${i}`} />)}
          </div>
        </div>
      </div>
    </div>
  , document.body)
}
