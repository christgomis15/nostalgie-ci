'use client'

import Link from 'next/link'
import { usePlayerStore } from '@/lib/player-store'

const FREQUENCES = [
  { freq: '101.1', villes: 'Abidjan – Banlieue' },
  { freq: '106.5', villes: 'Bouaké – Katiola – Botro – Béoumi – Sakassou – Tiébissou – Prikro' },
  { freq: '92.8',  villes: 'Yamoussoukro – Toumodi – Dimbokro – Bouaflé – Sinfra – Zuénoula – Oumé – Guibéroua – Bonon' },
  { freq: '97.3',  villes: 'San-Pédro – Soubré – Sassandra – Taï – Méagui – Grand-Béréby – Buyo – Lakota' },
  { freq: '98.3',  villes: 'Daloa et environs' },
  { freq: '91.7',  villes: 'Korhogo et environs' },
  { freq: '87.9',  villes: 'Abengourou et environs' },
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
      <div className="freq-footer">
        <div className="freq-footer-inner">
          <p className="freq-footer-title">Fréquences en Côte d&apos;Ivoire</p>
          <div className="freq-list">
            {FREQUENCES.map((f) => (
              <div key={f.freq} className="freq-row">
                <span className="freq-number">{f.freq}</span>
                <span className="freq-fm-tag">FM</span>
                <span className="freq-cities">{f.villes}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
