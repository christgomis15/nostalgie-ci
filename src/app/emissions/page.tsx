import type { Metadata } from 'next'
import EmissionsClient from './EmissionsClient'

export const metadata: Metadata = {
  title: 'Nos Émissions',
  description: 'Découvrez la grille des émissions de Nostalgie CI : animateurs, horaires et programmes de la radio Sérieusement Décalée, 101.1 FM Abidjan.',
  alternates: { canonical: 'https://www.nostalgie.ci/emissions' },
  openGraph: {
    title: 'Nos Émissions — Nostalgie CI',
    description: 'La grille des émissions de Nostalgie CI : animateurs, horaires et programmes.',
    url: 'https://www.nostalgie.ci/emissions',
  },
}

export default function EmissionsPage() {
  return <EmissionsClient />
}
