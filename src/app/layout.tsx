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

const SITE_URL = 'https://www.nostalgie.ci'
const SITE_TITLE = 'Nostalgie CI — 101.1 FM · Sérieusement Décalée'
const SITE_DESCRIPTION = 'Radio Nostalgie CI — La première radio commerciale privée de Côte d\'Ivoire. Écoutez le direct sur 101.1 FM à Abidjan et sur nos fréquences dans tout le pays.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: '%s · Nostalgie CI' },
  description: SITE_DESCRIPTION,
  keywords: 'radio, Nostalgie, Côte d\'Ivoire, Abidjan, 101.1 FM, musique, coupé-décalé, zouglou',
  manifest: '/manifest.json',
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Nostalgie CI',
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: 'Nostalgie CI',
    locale: 'fr_CI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'RadioStation',
  name: 'Nostalgie CI',
  alternateName: 'Nostalgie Côte d\'Ivoire',
  url: SITE_URL,
  logo: `${SITE_URL}/img/nostalgie-logo.png`,
  slogan: 'Sérieusement Décalée',
  broadcastAffiliateOf: { '@type': 'Organization', name: 'Nostalgie' },
  areaServed: 'Côte d\'Ivoire',
  sameAs: [
    'https://www.facebook.com/nostalgiecotedivoire',
    'https://www.instagram.com/nostalgiecotedivoire',
    'https://www.youtube.com/@nostalgiecotedivoire8471',
    'https://www.tiktok.com/@nostalgiecotedivoire',
  ],
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
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=Oswald:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
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