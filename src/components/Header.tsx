'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePlayerStore } from '@/lib/player-store'

const NAV_LINKS = [
  { href: '/',          label: 'Accueil'   },
  { href: '/emissions', label: 'Émissions' },
  { href: '/actus',     label: 'Actus'     },
  { href: '/podcasts',  label: 'Podcasts'  },
  { href: '/dedicaces', label: 'Dédicaces' },
  { href: '/contact',   label: 'Contact'   },
]

export default function Header() {
  const pathname = usePathname()
  const { isPlaying, toggle } = usePlayerStore()

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Logo */}
        <Link href="/" className="logo">
          <span className="logo-text">NOSTALGIE</span>
          <span className="logo-freq">101.1 FM</span>
        </Link>

        {/* Navigation */}
        <nav className="main-nav">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${pathname === href ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Pill DIRECT */}
        <button
          className={`pill-direct ${isPlaying ? 'playing' : ''}`}
          onClick={toggle}
          aria-label="Écouter le direct"
        >
          <span className="pill-dot" />
          DIRECT
        </button>
      </div>
    </header>
  )
}