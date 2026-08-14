'use client'
import { useEmissions } from './useEmissions'

// Émissions qui existent uniquement pour Podcasts & Replays (pas dans la grille de diffusion /emissions)
export const EXTRA_PODCAST_EMISSIONS = ["DTA : Dans La Tête d'Un Ado"]

// Émissions de la grille de diffusion à ne pas proposer ici (pas de podcasts/replays pour ces formats,
// ou doublon avec une entrée de EXTRA_PODCAST_EMISSIONS ci-dessus)
const EXCLUDED_PODCAST_EMISSIONS = [
  'Flash Info', 'Retourne Les Hits', 'Brand New', 'Tchika Tchika Boom',
  'Le Tchika Tchika boom', 'Good Morning Holidays ', "Dans la tête d'un Ado",
]

export function usePodcastEmissionOptions(): string[] {
  const emissions = useEmissions()
  return [
    ...emissions.map(e => e.title).filter(t => !EXCLUDED_PODCAST_EMISSIONS.includes(t)),
    ...EXTRA_PODCAST_EMISSIONS,
  ]
}
