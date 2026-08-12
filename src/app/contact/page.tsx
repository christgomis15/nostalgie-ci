import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Nous Contacter',
  description: 'Contactez Nostalgie CI pour vos demandes commerciales, partenariats événementiels et espaces publicitaires. Réponse sous 24h ouvrées.',
  alternates: { canonical: 'https://www.nostalgie.ci/contact' },
  openGraph: {
    title: 'Nous Contacter — Nostalgie CI',
    description: 'Contactez Nostalgie CI pour vos demandes commerciales, partenariats et espaces publicitaires.',
    url: 'https://www.nostalgie.ci/contact',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
