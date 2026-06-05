'use client'

import Link from 'next/link'
import { usePlayerStore } from '@/lib/player-store'

export default function Accueil() {
  const { isPlaying, toggle } = usePlayerStore()

  return (
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
  )
}
