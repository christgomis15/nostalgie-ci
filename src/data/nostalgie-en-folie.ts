// Habillage « Nostalgie en Folie » de la page d'accueil.
// Le bandeau de l'événement remplace le hero habituel jusqu'à la fin du
// dernier jour, puis le hero classique revient tout seul (aucun push requis).
// Pour l'édition suivante : changer les dates/textes ci-dessous et les
// images public/img/nef-*.

export const NEF = {
  // true = affiché sur l'accueil (validé par la Direction Marketing le 5 nov. 2026)
  valide: true,
  // Heure d'Abidjan = UTC
  debut: '2026-11-28T00:00:00Z',
  fin: '2026-11-30T00:00:00Z',
  jours: { de: '28', a: '29', mois: 'NOV. 2026', libelle: 'SAM. & DIM.' },
  lieu: { nom: 'INJS', quartier: 'Marcory' },
  itineraire: 'https://www.google.com/maps/search/?api=1&query=INJS+Marcory+Abidjan',
  // Exposants & annonceurs
  telephone: { affiche: '+225 20 27 21 10 53', lien: 'tel:+2252027211053' },
  // img = icône noire dans le rond or · logo = remplace le rond (logo en couleur)
  activites: [
    { img: '/img/nef-shopping.svg', label: 'Shopping' },
    { img: '/img/nef-concert.svg', label: 'Concerts' },
    { logo: '/img/nef-nostakids.png', label: 'Village Enfant' },
    { img: '/img/nef-sante.svg', label: 'Village Santé' },
    { img: '/img/nef-fitness.svg', label: 'Fitness' },
  ] as { img?: string; logo?: string; label: string }[],
}

export function isNefActive(now = Date.now()) {
  return NEF.valide && now < Date.parse(NEF.fin)
}
