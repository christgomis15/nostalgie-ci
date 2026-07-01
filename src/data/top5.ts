// ═══════════════════════════════════════════════════════════════════
//  TOP 5 — Titres les plus diffusés sur Nostalgie CI
//  Mise à jour hebdomadaire via Google Sheet (à venir)
//  Pour l'instant : modifier directement ce fichier
//
//  spotifyId  = partie après /track/ ou /album/ dans l'URL Spotify
//  spotifyType = 'track' pour un titre, 'album' pour un album
// ═══════════════════════════════════════════════════════════════════

export interface Top5Item {
  rang: number
  artiste: string
  titre: string
  passages: number
  spotifyId: string
  spotifyType: 'track' | 'album'
  coverImg: string  // pochette dans /public/img/top5/
}

export const TOP5: {
  semaine: string
  items: Top5Item[]
} = {
  semaine: '22 – 28 juin 2026',
  items: [
    {
      rang: 1,
      artiste: 'KEDJEVARA',
      titre: 'Allume le feu',
      passages: 27,
      spotifyId: '3yGbVUTTg1qgAsvl1qVd0M',
      spotifyType: 'album',
      coverImg: '/img/top5/rang1.jpg',
    },
    {
      rang: 2,
      artiste: 'Detty K',
      titre: 'Gbo',
      passages: 26,
      spotifyId: '1w85Bcjvy0WjxUxppkrxEg',
      spotifyType: 'track',
      coverImg: '/img/top5/rang2.jpg',
    },
    {
      rang: 3,
      artiste: 'DAVID TAYORAULT VS Nadeége M\'Badou',
      titre: 'Froufrou Conjugal',
      passages: 26,
      spotifyId: '3si0KQHZKzu5Yljo34Q3gL',
      spotifyType: 'track',
      coverImg: '/img/top5/rang3.jpg',
    },
    {
      rang: 4,
      artiste: 'Farruko, Greeicy, Steve Aoki',
      titre: 'YAPAQUE',
      passages: 25,
      spotifyId: '67kmVaXtdmcy856hKjHb3y',
      spotifyType: 'track',
      coverImg: '/img/top5/rang4.jpg',
    },
    {
      rang: 5,
      artiste: 'Tiakola',
      titre: 'Mélo Décalé',
      passages: 24,
      spotifyId: '4Olg35ikUrPTvhqwFWveRL',
      spotifyType: 'track',
      coverImg: '/img/top5/rang5.jpg',
    },
  ],
}
