import { useEffect, useState } from 'react'

interface NowPlaying {
  isLive: boolean
  artist: string | null
  title: string | null
}

const POLL_MS = 25_000

export function useNowPlaying(enabled: boolean): NowPlaying {
  const [data, setData] = useState<NowPlaying>({ isLive: false, artist: null, title: null })

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch('/api/now-playing', { cache: 'no-store' })
        const json = await res.json()
        if (!cancelled) setData(json)
      } catch {
        if (!cancelled) setData({ isLive: false, artist: null, title: null })
      }
    }

    fetchNowPlaying()
    const id = setInterval(fetchNowPlaying, POLL_MS)
    return () => { cancelled = true; clearInterval(id) }
  }, [enabled])

  return data
}
