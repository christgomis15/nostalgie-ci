'use client'
import { useEmissions } from './useEmissions'

// Émissions qui existent uniquement pour Podcasts & Replays (pas dans la grille de diffusion /emissions)
export const EXTRA_PODCAST_EMISSIONS = ["DTA : Dans la Tête d'Ado"]

export function usePodcastEmissionOptions(): string[] {
  const emissions = useEmissions()
  return [...emissions.map(e => e.title), ...EXTRA_PODCAST_EMISSIONS]
}
