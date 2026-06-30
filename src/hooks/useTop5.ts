'use client'
import { useState, useEffect } from 'react'
import { TOP5, type Top5Item } from '@/data/top5'

export interface Top5Data {
  semaine: string
  items: Top5Item[]
}

export function useTop5(): Top5Data {
  const [data, setData] = useState<Top5Data>(TOP5)

  useEffect(() => {
    let cancelled = false
    const load = (attempt = 1) => {
      fetch('/api/top5', { cache: 'no-store' })
        .then(r => (r.ok ? r.json() : null))
        .then((json: Top5Data | null) => {
          if (cancelled) return
          if (json?.items?.length) {
            setData({
              ...json,
              items: json.items.map((item, i) => ({
                ...item,
                coverImg: item.coverImg || TOP5.items[i]?.coverImg || '',
              })),
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
