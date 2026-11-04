import type { Metadata } from 'next'
import HomePage from '@/components/HomePage'

// Aperçu de l'accueil avec l'habillage Nostalgie en Folie, pour validation
// par la Direction Marketing avant mise en ligne (lien non référencé).
export const metadata: Metadata = {
  title: 'Aperçu — Nostalgie en Folie',
  robots: { index: false, follow: false },
}

export default function ApercuNostalgieEnFolie() {
  return <HomePage forceNef />
}
