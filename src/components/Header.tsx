'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { usePlayerStore } from '@/lib/player-store'
import liveConfig from '@/data/live-config'

const NAV_LINKS = [
  { href: '/',          label: 'Accueil'           },
  { href: '/emissions', label: 'Émissions'          },
  { href: '/actus',     label: 'Actus'              },
  { href: '/podcasts',  label: 'Podcasts & Replay'  },
  { href: '/dedicaces', label: 'Dédicaces'          },
  { href: '/contact',   label: 'Contact'            },
  { href: '/live',      label: 'Live'               },
]

export default function Header() {
  const pathname = usePathname()
  const { isPlaying, isLoading, toggle } = usePlayerStore()
  const [open, setOpen] = useState(false)

  // Ferme le menu si on change de page
  useEffect(() => { setOpen(false) }, [pathname])

  // Bloque le scroll du body quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          {/* Hamburger — mobile uniquement */}
          <button
            className="hamburger"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
          >
            <span className={`ham-line ${open ? 'open' : ''}`} />
            <span className={`ham-line ${open ? 'open' : ''}`} />
            <span className={`ham-line ${open ? 'open' : ''}`} />
          </button>

          {/* Logo */}
          <Link href="/" className="logo">
            <span className="logo-text">NOSTALGIE</span>
            <span className="logo-freq">101.1 FM</span>
          </Link>

          {/* Navigation desktop */}
          <nav className="main-nav">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link ${pathname === href ? 'active' : ''} ${href === '/live' ? 'nav-live' : ''}`}
              >
                {href === '/live' && liveConfig.isLive && (
                  <span className="nav-live-dot" />
                )}
                {label}
              </Link>
            ))}
          </nav>

          {/* Pill DIRECT */}
          <button
            className={`pill-direct ${isPlaying ? 'playing' : ''}`}
            onClick={toggle}
            aria-label="Écouter le direct"
            disabled={isLoading}
          >
            <span className="pill-dot" />
            {isLoading ? '...' : 'DIRECT'}
          </button>
        </div>
      </header>

      {/* Overlay sombre */}
      {open && (
        <div className="drawer-overlay" onClick={() => setOpen(false)} />
      )}

      {/* Tiroir gauche */}
      <nav className={`drawer ${open ? 'drawer-open' : ''}`} aria-hidden={!open}>
        <div className="drawer-header">
          <span className="drawer-logo">NOSTALGIE</span>
          <span className="drawer-freq">101.1 FM</span>
        </div>
        <ul className="drawer-links">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`drawer-link ${pathname === href ? 'active' : ''} ${href === '/live' ? 'drawer-live' : ''}`}
                onClick={() => setOpen(false)}
              >
                {href === '/live' && liveConfig.isLive && (
                  <span className="nav-live-dot" />
                )}
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
