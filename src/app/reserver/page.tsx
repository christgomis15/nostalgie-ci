import type { Metadata } from 'next'
import ReserverClient from './ReserverClient'

export const metadata: Metadata = {
  title: 'Réserver un Espace Publicitaire',
  description: 'Réservez votre espace publicitaire sur Nostalgie CI, la radio Sérieusement Décalée de Côte d\'Ivoire. Devis instantané, confirmation sous 24h.',
  alternates: { canonical: 'https://www.nostalgie.ci/reserver' },
  openGraph: {
    title: 'Réserver un Espace Publicitaire — Nostalgie CI',
    description: 'Réservez votre espace publicitaire sur Nostalgie CI, devis instantané.',
    url: 'https://www.nostalgie.ci/reserver',
  },
}

export default function ReserverPage() {
  return <ReserverClient />
}
