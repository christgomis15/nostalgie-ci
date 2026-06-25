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
  semaine: '15 – 20 juin 2026',
  items: [
    {
      rang: 1,
      artiste: 'Detty K',
      titre: 'Gbo',
      passages: 30,
      spotifyId: '1w85Bcjvy0WjxUxppkrxEg',
      spotifyType: 'track',
      coverImg: '/img/top5/rang1.jpg',
    },
    {
      rang: 2,
      artiste: 'Paulo Chakal feat. Ameka Zraï',
      titre: 'Bobitana',
      passages: 24,
      spotifyId: '2d4kzXLc2vawOFvdkfDPJW',
      spotifyType: 'track',
      coverImg: '/img/top5/rang2.jpg',
    },
    {
      rang: 3,
      artiste: 'Kedjevara',
      titre: 'Allume le feu',
      passages: 23,
      spotifyId: '3yGbVUTTg1qgAsvl1qVd0M',
      spotifyType: 'album',
      coverImg: '/img/top5/rang3.jpg',
    },
    {
      rang: 4,
      artiste: 'Roseline Layo',
      titre: 'On reprend',
      passages: 22,
      spotifyId: '2LE1reWJSlMNlZDwAEOKVE',
      spotifyType: 'track',
      coverImg: '/img/top5/rang4.jpg',
    },
    {
      rang: 5,
      artiste: 'Mako le King feat. Yilim',
      titre: 'Pour moi seul',
      passages: 21,
      spotifyId: '3crlkgUSq8eV3r6Csjl96h',
      spotifyType: 'track',
      coverImg: '/img/top5/rang5.jpg',
    },
  ],
}
