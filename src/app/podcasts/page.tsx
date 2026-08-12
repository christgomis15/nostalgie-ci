import type { Metadata } from 'next'
import PodcastsClient from './PodcastsClient'

export const metadata: Metadata = {
  title: 'Podcasts & Replays',
  description: 'Réécoutez les meilleurs moments de vos émissions préférées sur Nostalgie CI : podcasts, replays audio et vidéo à la demande.',
  alternates: { canonical: 'https://www.nostalgie.ci/podcasts' },
  openGraph: {
    title: 'Podcasts & Replays — Nostalgie CI',
    description: 'Réécoutez les meilleurs moments de vos émissions préférées sur Nostalgie CI.',
    url: 'https://www.nostalgie.ci/podcasts',
  },
}

export default function PodcastsPage() {
  return <PodcastsClient />
}
