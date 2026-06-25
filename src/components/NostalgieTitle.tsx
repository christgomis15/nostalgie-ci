'use client'

import { useRef, useEffect } from 'react'

/*
 * Technique :
 * - Deux calques SVG superposés : texte blanc rempli + texte transparent avec stroke or
 * - requestAnimationFrame déplace strokeDashoffset chaque frame → point voyage sur les contours
 * - getComputedTextLength() mesure la largeur réelle → estimation du périmètre des glyphes
 */

const DOT_PX  = 18   // longueur visible du point (px le long du contour)
const SPEED   = 120  // vitesse de déplacement (px/s de chemin)

const TEXT_BASE: React.CSSProperties = {
  fontFamily : "'Playfair Display', serif",
  fontSize   : '100px',
  fontWeight : 900,
  letterSpacing: '-3px',
}

export default function NostalgieTitle() {
  const dotRef = useRef<SVGTextElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const el = dotRef.current
    if (!el) return

    let gap    = 6000  // gap initial (sera recalculé après mesure)
    let offset = 0
    let last   = performance.now()

    /* ── Mesure du périmètre approximatif ── */
    function measure() {
      if (!dotRef.current) return
      const advanceW = dotRef.current.getComputedTextLength()
      if (advanceW < 50) return                    // fonte pas encore chargée
      // Pour Playfair Display Black caps à 100px :
      // périmètre total des glyphes ≈ avance × 5, avec 1.3× de marge de sécurité
      gap = Math.round(advanceW * 5 * 1.3)
      if (dotRef.current) dotRef.current.style.strokeDasharray = `${DOT_PX} ${gap}`
    }

    measure()
    document.fonts.ready.then(measure)

    /* ── Boucle d'animation ── */
    function tick(now: number) {
      const dt = (now - last) / 1000
      last = now

      offset += SPEED * dt
      const cycle = DOT_PX + gap
      if (offset >= cycle) offset -= cycle

      if (dotRef.current) dotRef.current.style.strokeDashoffset = String(-offset)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <svg
      className="h2-title-svg"
      viewBox="0 0 710 108"
      overflow="visible"
      aria-label="NOSTALGIE"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Calque 1 — texte blanc cassé visible */}
      <text
        x="0" y="95"
        style={{ ...TEXT_BASE, fill: '#F5F0E8' }}
      >
        NOSTALGIE
      </text>

      {/* Calque 2 — point doré animé sur le contour des lettres */}
      <text
        ref={dotRef}
        x="0" y="95"
        style={{
          ...TEXT_BASE,
          fill          : 'none',
          stroke        : '#D4A843',
          strokeWidth   : '3.5',
          strokeLinecap : 'round',
          strokeDasharray  : `${DOT_PX} 6000`,  // mis à jour par measure()
          strokeDashoffset : '0',
          filter: 'drop-shadow(0 0 6px rgba(212,168,67,0.9))',
        }}
      >
        NOSTALGIE
      </text>
    </svg>
  )
}
