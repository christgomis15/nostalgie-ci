'use client'
import { useState, useEffect } from 'react'
import { PODCASTS, REPLAYS_AUDIO, REPLAYS_VIDEO, type ContentItem } from '@/data/replay-content'

export interface PodcastsData {
  podcasts: ContentItem[]
  audio: ContentItem[]
  video: ContentItem[]
}

const FALLBACK: PodcastsData = { podcasts: PODCASTS, audio: REPLAYS_AUDIO, video: REPLAYS_VIDEO }

export function usePodcasts(): PodcastsData {
  const [data, setData] = useState<PodcastsData>(FALLBACK)

  useEffect(() => {
    let cancelled = false
    const load = (attempt = 1) => {
      fetch('/api/podcasts', { cache: 'no-store' })
        .then(r => (r.ok ? r.json() : null))
        .then((json: PodcastsData | null) => {
          if (cancelled) return
          const hasAny = json && ((json.podcasts?.length ?? 0) + (json.audio?.length ?? 0) + (json.video?.length ?? 0) > 0)
          if (hasAny) {
            setData({
              podcasts: json!.podcasts ?? [],
              audio: json!.audio ?? [],
              video: json!.video ?? [],
            })
          } else if (attempt < 3) {
            setTimeout(() => load(attempt + 1), 2000)
          }
        })
        .catch(() => { if (!cancelled && attempt < 3) setTimeout(() => load(attempt + 1), 2000) })
    }
    load()
    return () => { cancelled = true }
  }, [])

  return data
}
