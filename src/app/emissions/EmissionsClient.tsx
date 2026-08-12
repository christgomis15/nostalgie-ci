'use client'

import { useEmissions } from '@/hooks/useEmissions'

export default function EmissionsClient() {
  const emissions = useEmissions()

  return (
    <div className="em-section">
      <div className="page-section">
        <p className="section-label">Sur vos ondes</p>
        <h1 className="section-title">Nos Émissions</h1>
      </div>
      <div className="em-grid">
        {emissions.map((em) => (
          <div key={em.title} className="em-card">
            <img
              src={em.img}
              alt={em.title}
              className="em-img"
              onError={e => { (e.target as HTMLImageElement).src = '/img/wc2026.jpeg' }}
            />
            <div className="em-overlay">
              <p className="em-tag">{em.tag} · {em.schedule}</p>
              <h3 className="em-title-card">{em.title}</h3>
              {em.animateurs && <p className="em-animateurs">{em.animateurs}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
