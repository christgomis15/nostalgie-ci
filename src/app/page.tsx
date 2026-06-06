'use client'

import Link from 'next/link'
import { usePlayerStore } from '@/lib/player-store'

const FREQUENCES = [
  {
    freq: '101.1',
    city: 'Abidjan',
    zone: 'Banlieue',
  },
  {
    freq: '106.5',
    city: 'Bouaké',
    zone: 'Katiola · Botro · Béoumi · Sakassou · Tiébissou · Prikro',
  },
  {
    freq: '92.8',
    city: 'Yamoussoukro',
    zone: 'Toumodi · Dimbokro · Bouaflé · Sinfra · Zuénoula · Oumé · Guibéroua · Bonon',
  },
  {
    freq: '97.3',
    city: 'San-Pédro',
    zone: 'Soubré · Sassandra · Taï · Méagui · Grand-Béréby · Buyo · Lakota',
  },
  {
    freq: '98.3',
    city: 'Daloa',
    zone: 'et environs',
  },
  {
    freq: '91.7',
    city: 'Korhogo',
    zone: 'et environs',
  },
  {
    freq: '87.9',
    city: 'Abengourou',
    zone: 'et environs',
  },
]

export default function Accueil() {
  const { isPlaying, toggle } = usePlayerStore()

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: "url('/img/hero-bg.jpg')" }} />
        <div className="hero-grad" />
        <div className="page-section hero-c">
          <p className="hero-eye">Première Radio Commerciale Privée de Côte d&apos;Ivoire</p>
          <h1 className="hero-title">NOSTALGIE</h1>
          <p className="hero-slogan"><em>Sérieusement Décalée.</em></p>
          <p className="hero-villes">Abidjan · Bouaké · Yamoussoukro · San-Pédro · Korhogo · 101.1 FM</p>
          <div className="hero-actions">
            <button className="btn btn-or" onClick={toggle}>
              {isPlaying ? '⏸ En cours...' : '▶ Écouter en Direct'}
            </button>
            <Link href="/podcasts" className="btn btn-outline">Nos Podcasts</Link>
          </div>
        </div>
      </section>

      {/* ── Fréquences ── */}
      <section className="freq-section">
        <div className="page-section">
          <p className="section-label">Sur toute la Côte d&apos;Ivoire</p>
          <h2 className="section-title">Nos Fréquences</h2>
          <div className="freq-grid">
            {FREQUENCES.map((f) => (
              <div key={f.freq} className="freq-card">
                <div className="freq-number">{f.freq}</div>
                <div className="freq-fm">FM</div>
                <div className="freq-city">{f.city}</div>
                <div className="freq-zone">{f.zone}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
