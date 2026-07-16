'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { type Emission } from '@/data/emissions'

const SLIDE_DURATION = 4500

export default function EmissionsSlideshow({ emissions }: { emissions: Emission[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (emissions.length <= 1) return
    const t = setInterval(() => setIndex(i => (i + 1) % emissions.length), SLIDE_DURATION)
    return () => clearInterval(t)
  }, [emissions.length])

  if (emissions.length === 0) return null

  return (
    <div className="h2-em-slideshow">
      {emissions.map((em, i) => (
        <Link
          key={em.title}
          href="/emissions"
          className={`h2-em-slide ${i === index ? 'active' : ''}`}
        >
          <img
            src={em.img}
            alt={em.title}
            onError={e => { (e.target as HTMLImageElement).src = '/img/wc2026.jpeg' }}
          />
          <div className="h2-em-slide-overlay">
            <p className="h2-em-slide-tag">{em.tag} · {em.schedule}</p>
            <h3 className="h2-em-slide-title">{em.title}</h3>
          </div>
        </Link>
      ))}
      {emissions.length > 1 && (
        <div className="h2-em-dots">
          {emissions.map((em, i) => (
            <button
              key={em.title}
              className={`h2-em-dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Émission ${i + 1} : ${em.title}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
