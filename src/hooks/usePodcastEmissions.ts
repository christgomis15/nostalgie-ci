'use client'
import { useEmissions } from './useEmissions'

// Émissions qui existent uniquement pour Podcasts & Replays (pas dans la grille de diffusion /emissions)
export const EXTRA_PODCAST_EMISSIONS = ["DTA : Dans La Tête d'Un Ado", 'Kaboré Fait Son Show']

// Émissions de la grille de diffusion à NE PAS proposer comme filtre ici
// (formats sans replay vidéo, doublon avec EXTRA_PODCAST_EMISSIONS, ou entrée
// qui n'est pas une vraie émission). La comparaison est insensible à la casse
// et aux espaces superflus : les titres saisis dans le Google Sheet ne sont
// pas toujours normalisés (ex : "Le Tchika tchika boom ").
const EXCLUDED_PODCAST_EMISSIONS = [
  'Flash Info',
  'Retourne Les Hits',
  'Good Morning Holidays',
  "Dans la tête d'un Ado",
  'Kaboré Fait Son Show',
  'Le Brand New',
  'Le Tchika tchika boom',
  'Radio tubes',
  'Nostatop',
  'La Peufra',
  "C'est la rentrée sur Nostalgie",
]

const norm = (s: string) => s.trim().toLowerCase()
const EXCLUDED_NORM = EXCLUDED_PODCAST_EMISSIONS.map(norm)

export function usePodcastEmissionOptions(): string[] {
  const emissions = useEmissions()
  return [
    ...emissions.map(e => e.title.trim()).filter(t => !EXCLUDED_NORM.includes(norm(t))),
    ...EXTRA_PODCAST_EMISSIONS,
  ]
}
