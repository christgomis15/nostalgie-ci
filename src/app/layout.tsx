import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/Header'
import WebradioTicker from '@/components/WebradioTicker'
import WeatherAlertBanner from '@/components/WeatherAlertBanner'
import PlayerBar from '@/components/PlayerBar'
import PWARegister from '@/components/PWARegister'
import PWAInstallBanner from '@/components/PWAInstallBanner'
import PWASplash from '@/components/PWASplash'
import AudienceSignupModal from '@/components/AudienceSignupModal'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'Nostalgie CI — 101.1 FM · Sérieusement Décalée',
  description: 'Radio Nostalgie CI — La première radio commerciale privée de Côte d\'Ivoire. Écoutez le direct sur 101.1 FM à Abidjan.',
  keywords: 'radio, Nostalgie, Côte d\'Ivoire, Abidjan, 101.1 FM, musique',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Nostalgie CI',
  },
  openGraph: {
    title: 'Nostalgie CI — 101.1 FM',
    description: 'Sérieusement Décalée. Écoutez la radio en direct.',
    locale: 'fr_CI',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#D4A843',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Ticker webradios — fixe en haut */}
        <WebradioTicker />

        {/* Header nav — sous le ticker */}
        <Header />

        {/* Bandeau d'alerte météo — visible uniquement si alerte active, sous les barres fixes */}
        <WeatherAlertBanner />

        {/* Contenu de la page */}
        <main>{children}</main>

        {/* Player bar — fixe en bas, persiste sur toutes les pages */}
        <PlayerBar />
        <PWASplash />
        <PWAInstallBanner />
        <PWARegister />
        <AudienceSignupModal />
        <Analytics />
      </body>
    </html>
  )
}