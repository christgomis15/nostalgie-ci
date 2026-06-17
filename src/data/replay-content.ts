// ═══════════════════════════════════════════════════════════════════
//  Contenu Podcasts & Replay
//  Pour ajouter un épisode : copier un bloc { } et renseigner les champs.
//  youtubeId = la partie après "v=" dans l'URL YouTube
//  Ex : https://www.youtube.com/watch?v=gDnPEIdCZrk → youtubeId: 'gDnPEIdCZrk'
// ═══════════════════════════════════════════════════════════════════

export interface ContentItem {
  id: number
  youtubeId: string
  titre: string
  emission: string
  date: string
  duree?: string
  description?: string
}

// ────────────────────────────────────────────────────────────────────
//  PODCASTS — contenus exclusifs web, non diffusés sur la radio
// ────────────────────────────────────────────────────────────────────
export const PODCASTS: ContentItem[] = [
  {
    id: 1,
    youtubeId: 'gDnPEIdCZrk',
    titre: 'Exemple de podcast exclusif',
    emission: 'Nostalgie CI',
    date: '13 juin 2026',
    duree: '12 min',
    description: 'Premier podcast exclusif web de Nostalgie CI.',
  },
]

// ────────────────────────────────────────────────────────────────────
//  REPLAY AUDIO — émissions passées ou séquences, avec image fixe
// ────────────────────────────────────────────────────────────────────
export const REPLAYS_AUDIO: ContentItem[] = [
  {
    id: 1,
    youtubeId: 'C4_u4sEPHaQ',
    titre: 'Parlons français',
    emission: 'Le Crazy Morning',
    date: '17 juin 2026',
  },
]

// ────────────────────────────────────────────────────────────────────
//  REPLAY VIDÉO — émissions filmées ou séquences vidéo
// ────────────────────────────────────────────────────────────────────
export const REPLAYS_VIDEO: ContentItem[] = [
  {
    id: 1,
    youtubeId: 'J-BiKCfjYRs',
    titre: 'Côte d\'Ivoire : quel numéro 9 pour démarrer face à l\'Équateur ?',
    emission: 'Nostafoot',
    date: '09 juin 2026',
  },
]
