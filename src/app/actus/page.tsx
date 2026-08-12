import type { Metadata } from 'next'
import ActusListClient from './ActusListClient'

export const metadata: Metadata = {
  title: 'Actualités',
  description: 'Toute l\'actualité locale, internationale, les événements et les potins suivis par Nostalgie CI, la radio Sérieusement Décalée de Côte d\'Ivoire.',
  alternates: { canonical: 'https://www.nostalgie.ci/actus' },
  openGraph: {
    title: 'Actualités — Nostalgie CI',
    description: 'Toute l\'actualité locale, internationale, les événements et les potins suivis par Nostalgie CI.',
    url: 'https://www.nostalgie.ci/actus',
  },
}

export default function ActusPage() {
  return <ActusListClient />
}
