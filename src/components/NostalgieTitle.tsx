'use client'

/*
 * NostalgieTitle — Titre SVG animé
 *
 * Technique : deux calques de texte SVG superposés.
 *  1. Calque base  : fill blanc cassé, pas de stroke → texte visible normal
 *  2. Calque dot   : fill transparent, stroke or, dasharray "12px dot + 4000px gap"
 *     → un seul point doré visible qui voyage sur le contour de chaque lettre
 *
 * L'animation CSS décale l'offset de 0 à -4012 (= dasharray total) sur 8s
 * pour un déplacement fluide et un boucle sans saut.
 */

export default function NostalgieTitle() {
  return (
    <svg
      className="h2-title-svg"
      viewBox="0 0 710 108"
      overflow="visible"
      aria-label="NOSTALGIE"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Calque 1 : texte plein blanc cassé ── */}
      <text
        x="0"
        y="95"
        fontFamily="'Playfair Display', serif"
        fontSize="100"
        fontWeight="900"
        fill="var(--blanc)"
        style={{ letterSpacing: '-3px' }}
      >
        NOSTALGIE
      </text>

      {/* ── Calque 2 : point doré animé sur le contour ── */}
      <text
        x="0"
        y="95"
        fontFamily="'Playfair Display', serif"
        fontSize="100"
        fontWeight="900"
        fill="none"
        stroke="#D4A843"
        strokeWidth="3"
        strokeLinecap="round"
        className="h2-dot-anim"
        style={{ letterSpacing: '-3px' }}
      >
        NOSTALGIE
      </text>
    </svg>
  )
}
