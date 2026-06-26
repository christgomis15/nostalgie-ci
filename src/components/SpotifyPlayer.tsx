'use client'
import { useEffect, useRef } from 'react'

// Types pour l'API iFrame Spotify
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyApi) => void
    _spotifyApi?: SpotifyApi
  }
}
interface SpotifyApi {
  createController(
    el: HTMLElement,
    opts: { uri: string; width: string | number; height: number },
    cb: (ctrl: SpotifyCtrl) => void
  ): void
}
interface SpotifyCtrl { play(): void; destroy(): void }

// Précharge le script Spotify dès que le module est importé
// pour qu'il soit déjà prêt quand l'utilisateur clique ▶
function preloadSpotifyApi() {
  if (typeof window === 'undefined') return
  if (document.getElementById('spotify-api')) return
  const s = document.createElement('script')
  s.id = 'spotify-api'
  s.src = 'https://open.spotify.com/embed/iframe-api/v1'
  s.async = true
  s.onload = () => { /* onSpotifyIframeApiReady sera appelé par Spotify */ }
  document.head.appendChild(s)
}

export function preloadSpotify() { preloadSpotifyApi() }

export default function SpotifyPlayer({
  type, id, height,
}: {
  type: 'track' | 'album'
  id: string
  height: number
}) {
  const divRef = useRef<HTMLDivElement>(null)
  const ctrlRef = useRef<SpotifyCtrl | null>(null)

  useEffect(() => {
    let cancelled = false

    function init(api: SpotifyApi) {
      if (cancelled || !divRef.current) return
      api.createController(
        divRef.current,
        { uri: `spotify:${type}:${id}`, width: '100%', height },
        (ctrl) => {
          if (cancelled) { ctrl.destroy(); return }
          ctrlRef.current = ctrl
          ctrl.play()
        }
      )
    }

    if (window._spotifyApi) {
      init(window._spotifyApi)
    } else {
      const prev = window.onSpotifyIframeApiReady
      window.onSpotifyIframeApiReady = (api) => {
        window._spotifyApi = api
        init(api)
        prev?.(api)
      }
      preloadSpotifyApi()
    }

    return () => {
      cancelled = true
      ctrlRef.current?.destroy()
      ctrlRef.current = null
    }
  }, [type, id, height])

  return (
    <div
      ref={divRef}
      style={{ borderRadius: '12px', overflow: 'hidden', minHeight: height }}
    />
  )
}
