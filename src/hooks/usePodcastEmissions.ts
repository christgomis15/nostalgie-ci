'use client'
import { useEmissions } from './useEmissions'

// Émissions qui existent uniquement pour Podcasts & Replays (pas dans la grille de diffusion /emissions)
export const EXTRA_PODCAST_EMISSIONS = ["DTA : Dans la Tête d'Ado"]

// Émissions de la grille de diffusion à ne pas proposer ici (pas de podcasts/replays pour ces formats)
const EXCLUDED_PODCAST_EMISSIONS = ['Flash Info', 'Retourne Les Hits', 'Brand New']

export function usePodcastEmissionOptions(): string[] {
  const emissions = useEmissions()
  return [
    ...emissions.map(e => e.title).filter(t => !EXCLUDED_PODCAST_EMISSIONS.includes(t)),
    ...EXTRA_PODCAST_EMISSIONS,
  ]
}
