import type { Metadata } from 'next'
import DedicacesClient from './DedicacesClient'

export const metadata: Metadata = {
  title: 'Envoyer une Dédicace',
  description: 'Envoyez votre dédicace en direct sur Nostalgie CI pendant Le Crazy Morning et Hits & Co. Faites plaisir à vos proches sur 101.1 FM.',
  alternates: { canonical: 'https://www.nostalgie.ci/dedicaces' },
  openGraph: {
    title: 'Envoyer une Dédicace — Nostalgie CI',
    description: 'Envoyez votre dédicace en direct sur Nostalgie CI pendant Le Crazy Morning et Hits & Co.',
    url: 'https://www.nostalgie.ci/dedicaces',
  },
}

export default function DedicacesPage() {
  return <DedicacesClient />
}
