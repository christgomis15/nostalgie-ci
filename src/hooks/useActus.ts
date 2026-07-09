'use client'
import { useState, useEffect } from 'react'
import { LOCALE, INTERNATIONALE, EVENTS, POTINS, type Article } from '@/data/actus'

export interface ActusData {
  locale: Article[]
  internationale: Article[]
  events: Article[]
  potins: Article[]
}

const FALLBACK: ActusData = { locale: LOCALE, internationale: INTERNATIONALE, events: EVENTS, potins: POTINS }

export function useActus(): ActusData {
  const [data, setData] = useState<ActusData>(FALLBACK)

  useEffect(() => {
    let cancelled = false
    const load = (attempt = 1) => {
      fetch('/api/actus', { cache: 'no-store' })
        .then(r => (r.ok ? r.json() : null))
        .then((json: { articles?: Article[] } | null) => {
          if (cancelled) return
          if (json?.articles?.length) {
            setData({
              locale: json.articles.filter(a => a.tab === 'locale'),
              internationale: json.articles.filter(a => a.tab === 'internationale'),
              events: json.articles.filter(a => a.tab === 'events'),
              potins: json.articles.filter(a => a.tab === 'potins'),
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
