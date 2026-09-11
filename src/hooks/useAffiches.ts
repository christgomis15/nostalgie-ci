'use client'
import { useState, useEffect } from 'react'

export interface Affiche {
  titre: string
  date: string
  img: string
}

export function useAffiches(): Affiche[] {
  const [affiches, setAffiches] = useState<Affiche[]>([])

  useEffect(() => {
    let cancelled = false
    const load = (attempt = 1) => {
      fetch('/api/affiches', { cache: 'no-store' })
        .then(r => (r.ok ? r.json() : null))
        .then((json: { affiches?: Affiche[] } | null) => {
          if (cancelled) return
          if (json?.affiches) {
            setAffiches(json.affiches)
          } else if (attempt < 3) {
            setTimeout(() => load(attempt + 1), 2000)
          }
        })
        .catch(() => { if (!cancelled && attempt < 3) setTimeout(() => load(attempt + 1), 2000) })
    }
    load()
    return () => { cancelled = true }
  }, [])

  return affiches
}
