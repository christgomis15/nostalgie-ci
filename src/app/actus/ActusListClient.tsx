'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useActus } from '@/hooks/useActus'
import { slugify } from '@/lib/slugify'

export default function ActusListClient() {
  const data = useActus()
  const [tab, setTab] = useState<'locale' | 'internationale' | 'events' | 'potins'>('events')
  const articles = data[tab]

  return (
    <section className="page-section">
      <p className="section-label">L&apos;info qui groove</p>
      <h1 className="section-title">Actualités</h1>
      <div className="atabs">
        <button className={`atab ${tab === 'events' ? 'active' : ''}`} onClick={() => setTab('events')}>
          Events Nostalgie
        </button>
        <button className={`atab ${tab === 'potins' ? 'active' : ''}`} onClick={() => setTab('potins')}>
          Potins
        </button>
        <button className={`atab ${tab === 'locale' ? 'active' : ''}`} onClick={() => setTab('locale')}>
          Actu Locale
        </button>
        <button className={`atab ${tab === 'internationale' ? 'active' : ''}`} onClick={() => setTab('internationale')}>
          Actu Internationale
        </button>
      </div>
      <div className="ac-grid">
        {articles.map((a) => (
          <Link key={a.title} href={`/actus/${slugify(a.title)}`} className="ac-card">
            <div className="ac-img">
              <img src={a.img} alt={a.title} style={a.imgPosition ? { objectPosition: a.imgPosition } : undefined} />
              <span className="ac-cat-badge">{a.cat}</span>
            </div>
            <div className="ac-body">
              <h3 className="ac-title-card">{a.title}</h3>
              <p className="ac-excerpt">{a.excerpt}</p>
              <p className="ac-date">{a.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
