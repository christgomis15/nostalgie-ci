import type { Metadata } from 'next'
import LiveClient from './LiveClient'

export const metadata: Metadata = {
  title: 'Live',
  description: 'Suivez le live vidéo de Nostalgie CI en direct de nos studios à Abidjan, Côte d\'Ivoire, avec chat en direct.',
  alternates: { canonical: 'https://www.nostalgie.ci/live' },
  openGraph: {
    title: 'Live — Nostalgie CI',
    description: 'Suivez le live vidéo de Nostalgie CI en direct de nos studios à Abidjan.',
    url: 'https://www.nostalgie.ci/live',
  },
}

export default function LivePage() {
  return <LiveClient />
}
