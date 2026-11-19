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
  telephone: { affiche: '+225 27 20 21 10 53', lien: 'tel:+2252720211053' },
  // Journalistes : formulaire Google d'accréditation presse
  accreditation: 'https://docs.google.com/forms/d/e/1FAIpQLSfk81AMrePSSkT7QP8XKdFviaaUO1Z4SQbung-Hh2AzNlYaWw/viewform',
  // img = icône noire dans le rond or · logo = remplace le rond (logo en couleur)
  // modal = la carte est cliquable et ouvre une fenêtre (kids = NostaKids City,
  // concerts / exposants = diaporama des visuels ci-dessous)
  activites: [
    { img: '/img/nef-shopping.svg', label: 'Shopping', modal: 'exposants' },
    { img: '/img/nef-concert.svg', label: 'Concerts', modal: 'concerts' },
    { logo: '/img/nef-nostakids.png', label: 'Village Enfant', modal: 'kids' },
    { img: '/img/nef-sante.svg', label: 'Village Santé' },
    { img: '/img/nef-fitness.svg', label: 'Fitness' },
  ] as { img?: string; logo?: string; label: string; modal?: 'kids' | 'concerts' | 'exposants' }[],
  // Affiches des concerts (1600 × 1200), dans l'ordre du diaporama
  concerts: [
    { img: '/img/nef-concerts/coupe-decale.jpg', style: 'Coupé-Décalé Biama', artistes: 'Azazou Satelite, Vitale, Safarel Obiang, Serge Beynaud, Bebi Philip, Force One, Oyoki' },
    { img: '/img/nef-concerts/zouglou.jpg', style: 'Zouglou', artistes: "Willy Gavara, Mako le King, Esaïe l'Original, Les Patrons, Molière, 100 Façons" },
    { img: '/img/nef-concerts/variete.jpg', style: 'Variété', artistes: 'Oviékan, Mula, Roseline Layo, Ismaël Isaac, Kajeem, TNT, Lil Jay' },
    { img: '/img/nef-concerts/rap-ivoire.jpg', style: 'Rap Ivoire', artistes: "Nifa Fanafoule, Dré-A, Elow'n, Jojo le Barbu, Suspect 95, Tazeboy, Ste Milano, Mister Chris" },
    { img: '/img/nef-concerts/nouvelle-scene.jpg', style: 'Nouvelle Scène', artistes: 'Widgunz, Jeune Lion, Wantché, Bmux Carter, Zazi' },
  ],
  // Visuels « J'y serai » des exposants (765 × 765, public/img/nef-exposants/)
  // Pour en ajouter un : déposer le fichier .webp et ajouter une ligne ici.
  exposants: [
    ['arome-spirituel', "L'Arôme Spirituel"],
    ['batik-habits-du-dimanche', 'Batik – Habits du Dimanche'],
    ['blessing-shop', 'Blessing Shop'],
    ['chez-mamou', 'Chez Mamou'],
    ['dr-scent', 'Dr Scent'],
    ['edd', 'EDD'],
    ['elsymar', 'Elsymar'],
    ['fantastika-kids', 'Fantastika Kids'],
    ['festives-by-sami', 'Festives by Sami'],
    ['ficta', 'FICTA – Tchologo Cocktail'],
    ['firdawshop', 'FirdawShop'],
    ['bethel', 'Chez les Garçons – Bethel'],
    ['ivoire-abotchi', 'Ivoire Abotchi'],
    ['jamel-design', 'Jamel Design & Services'],
    ['klaymi', 'KlayMi'],
    ['dinettes-africaines', 'Les Dînettes Africaines by DLS'],
    ['ptits-plats-de-myra', "Les P'tits Plats de Myra"],
    ['lileen-bio', 'Lileen Bio'],
    ['nagnin-creation', 'Nagnin Création'],
    ['maison-esona', 'Maison Esona'],
    ['maje-concept', "Ma'Je Concept"],
    ['makodjiby', 'Makodjiby'],
    ['matiks-miam', "Matik's Miam"],
    ['miss-sandwich', 'Miss Sandwich'],
    ['mj-confections', 'MJ Confections'],
    ['naima-confection', 'Naïma Confection'],
    ['nana-bio', 'Nana Bio'],
    ['jardin-nikhaia', 'Le Jardin Nikhaïa'],
    ['outfits-by-queen', 'Outfits by Queen'],
    ['pain-brochette', "Pain Brochette L'Abidjanaise"],
    ['phill-creations', 'Phill Créations'],
    ['le-pigs', "Le Pig'S by Cochon bio"],
    ['pizza-doudou', 'Pizza Doudou'],
    ['queen-bio-hair', 'Queen Bio Hair'],
    ['style-et-parfums', 'Style & Parfums'],
    ['ll-sweet-bar', 'L&L Sweet Bar'],
    ['syfat', 'Syfat'],
    ['winny-delices', 'Winny Délices'],
  ].map(([fichier, nom]) => ({ img: `/img/nef-exposants/${fichier}.webp`, nom })),
}

export function isNefActive(now = Date.now()) {
  return NEF.valide && now < Date.parse(NEF.fin)
}
