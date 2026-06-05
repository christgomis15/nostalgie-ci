export const metadata = { title: 'Émissions — Nostalgie CI' }

const EMISSIONS = [
  {
    title: 'Le Crazy Morning',
    tag: 'Matin',
    schedule: 'Lun–Ven · 06h–10h',
    animateurs: 'Arielle, Teeyah, Prince LB, Willy',
  },
  {
    title: 'Tchika Tchika Boom',
    tag: 'Milieu de journée',
    schedule: 'Lun–Ven · 11h–12h',
    animateurs: 'Bruno',
  },
  {
    title: 'Hits & Co',
    tag: 'Après-midi',
    schedule: 'Lun–Ven · 12h–15h',
    animateurs: 'Nanda',
  },
  {
    title: 'Brand New',
    tag: 'Nouveautés',
    schedule: 'Lun–Ven · 15h–16h',
    animateurs: 'Alvhin',
  },
  {
    title: "L'Afterwork",
    tag: 'Soirée',
    schedule: 'Lun–Jeu · 17h–19h',
    animateurs: '',
  },
  {
    title: 'Nostafoot',
    tag: 'Football',
    schedule: 'Lun–Jeu · 19h–21h',
    animateurs: 'Malick Traore, Kalen Damessi, Joelle H. Acina, Roland Danon',
  },
  {
    title: 'Flash Info',
    tag: 'Information',
    schedule: 'Lun–Sam · Toutes les heures',
    animateurs: 'Luise Martin, Armel Mendy',
  },
  {
    title: 'Matinales du Week-End',
    tag: 'Week-End',
    schedule: 'Sam–Dim · 07h–10h',
    animateurs: 'Desie, Frederick',
  },
  {
    title: 'La Peufra',
    tag: 'Culture',
    schedule: 'Samedis · 14h–16h',
    animateurs: 'Ozone Afrikbamba',
  },
  {
    title: 'Kaboré Fait Son Show',
    tag: 'Variétés',
    schedule: 'Sam–Dim · 18h–19h',
    animateurs: 'Kabore',
  },
  {
    title: 'Retourne Les Hits',
    tag: 'Club',
    schedule: 'Ven–Sam · 20h–00h',
    animateurs: 'DJ Philo',
  },
]

export default function Emissions() {
  return (
    <div className="em-section">
      <div className="page-section">
        <p className="section-label">Sur vos ondes</p>
        <h1 className="section-title">Nos Émissions</h1>
      </div>
      <div className="em-grid">
        {EMISSIONS.map((em) => (
          <div key={em.title} className="em-card">
            <div className="em-ph">{em.title[0]}</div>
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
