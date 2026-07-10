// ═══════════════════════════════════════════════════════════════════
//  ÉMISSIONS — contenu de secours (utilisé si le Google Sheet est vide/indisponible)
//  Gérées via le panneau /admin, onglet "Emissions" du Google Sheet
// ═══════════════════════════════════════════════════════════════════

export interface Emission {
  title: string
  tag: string
  schedule: string
  animateurs: string
  img: string
}

export const EMISSIONS: Emission[] = [
  { title: 'Le Crazy Morning', tag: 'Matin', schedule: 'Lun–Ven · 06h–10h', animateurs: 'Arielle, Teeyah, Prince LB, Willy', img: '/img/em-01.jpg' },
  { title: 'Tchika Tchika Boom', tag: 'Milieu de journée', schedule: 'Lun–Ven · 11h–12h', animateurs: 'Bruno', img: '/img/em-02.jpg' },
  { title: 'Hits & Co', tag: 'Après-midi', schedule: 'Lun–Ven · 12h–15h', animateurs: 'Nanda', img: '/img/em-03.jpg' },
  { title: 'Brand New', tag: 'Nouveautés', schedule: 'Lun–Ven · 15h–16h', animateurs: 'Alvhin', img: '/img/em-04.jpg' },
  { title: "L'Afterwork", tag: 'Soirée', schedule: 'Lun–Jeu · 17h–19h', animateurs: '', img: '/img/em-05.jpg' },
  { title: 'Nostafoot', tag: 'Football', schedule: 'Lun–Jeu · 19h–21h', animateurs: 'Malick Traore, Kalen Damessi, Joelle H. Acina, Roland Danon', img: '/img/em-06.jpg' },
  { title: 'Flash Info', tag: 'Information', schedule: 'Lun–Sam · Toutes les heures', animateurs: 'Luise Martin, Armel Mendy', img: '/img/em-07.jpg' },
  { title: 'Matinales du Week-End', tag: 'Week-End', schedule: 'Sam–Dim · 07h–10h', animateurs: 'Desie, Frederick', img: '/img/em-08.jpg' },
  { title: 'La Peufra', tag: 'Culture', schedule: 'Samedis · 14h–16h', animateurs: 'Ozone Afrikbamba', img: '/img/em-09.jpg' },
  { title: 'Kaboré Fait Son Show', tag: 'Variétés', schedule: 'Sam–Dim · 18h–19h', animateurs: 'Kabore', img: '/img/em-10.jpg' },
  { title: 'Retourne Les Hits', tag: 'Club', schedule: 'Ven–Sam · 20h–00h', animateurs: 'DJ Philo', img: '/img/em-11.jpg' },
]
