'use client'
import { useState, useEffect } from 'react'

export interface Sujet {
  titre: string
  emission: string
  question: string
  img: string
  date: string
}

export function useSujets(): { sujets: Sujet[]; loading: boolean } {
  const [sujets, setSujets] = useState<Sujet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = (attempt = 1) => {
      fetch('/api/sujets', { cache: 'no-store' })
        .then(r => (r.ok ? r.json() : null))
        .then((json: { sujets?: Sujet[] } | null) => {
          if (cancelled) return
          if (json?.sujets) {
            setSujets(json.sujets)
            setLoading(false)
          } else if (attempt < 3) {
            setTimeout(() => load(attempt + 1), 2000)
          } else {
            setLoading(false)
          }
        })
        .catch(() => {
          if (cancelled) return
          if (attempt < 3) setTimeout(() => load(attempt + 1), 2000)
          else setLoading(false)
        })
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { sujets, loading }
}
