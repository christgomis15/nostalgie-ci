'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SECTIONS = [
  { href: '/admin/actus', label: 'Actus', desc: 'Ajouter ou retirer un article (Locale, Internationale, Events, Potins)' },
  { href: '/admin/podcasts', label: 'Podcasts & Replays', desc: 'Ajouter ou retirer un épisode' },
  { href: '/admin/emissions', label: 'Émissions', desc: 'Ajouter ou retirer une émission de la grille' },
  { href: '/admin/top5', label: 'Top 5', desc: 'Mettre à jour le classement de la semaine' },
  { href: '/admin/top5-archives', label: 'Archives Top 5', desc: 'Consulter le classement par mois, trimestre, semestre ou année' },
  { href: '/admin/newsletter', label: 'Newsletter', desc: 'Composer et envoyer la newsletter hebdomadaire' },
  { href: '/admin/live', label: 'Live', desc: 'Activer ou désactiver le live YouTube sur /live' },
  { href: '/admin/ttb', label: 'Indice TTB', desc: "Publier l'indice du jour de Tchika Tchika Boom (pop-up 10h45–11h15)" },
]

export default function AdminHome() {
  const router = useRouter()

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <section className="page-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p className="section-label">Administration</p>
          <h1 className="section-title">Nostalgie CI</h1>
        </div>
        <button className="btn btn-outline" onClick={logout}>Se déconnecter</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginTop: 32 }}>
        {SECTIONS.map(s => (
          <Link key={s.href} href={s.href} className="admin-card">
            <h3>{s.label}</h3>
            <p>{s.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
