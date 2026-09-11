import type { Metadata } from 'next'
import SujetsClient from './SujetsClient'

export const metadata: Metadata = {
  title: 'Sujets du jour',
  description: 'Réagissez aux sujets du jour de vos émissions préférées sur Nostalgie CI, directement sur le site — laissez votre avis et vos commentaires.',
  alternates: { canonical: 'https://www.nostalgie.ci/sujets' },
  openGraph: {
    title: 'Sujets du jour — Nostalgie CI',
    description: 'Réagissez aux sujets du jour de vos émissions préférées, directement sur le site.',
    url: 'https://www.nostalgie.ci/sujets',
  },
}

export default function SujetsPage() {
  return <SujetsClient />
}
