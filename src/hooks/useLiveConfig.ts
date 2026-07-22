'use client'
import { useState, useEffect } from 'react'
import liveConfigFallback from '@/data/live-config'

export interface LiveConfig {
  isLive: boolean
  videoId: string
  title: string
  description: string
}

export function useLiveConfig(): LiveConfig {
  const [data, setData] = useState<LiveConfig>(liveConfigFallback)

  useEffect(() => {
    let cancelled = false
    fetch('/api/live', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then((json: Partial<LiveConfig> | null) => {
        if (cancelled || !json || json.videoId === undefined) return
        setData({
          isLive: !!json.isLive,
          videoId: json.videoId || '',
          title: json.title || 'Nostalgie Live',
          description: json.description || '',
        })
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  return data
}
