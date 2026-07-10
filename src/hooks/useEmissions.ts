'use client'
import { useState, useEffect } from 'react'
import { EMISSIONS, type Emission } from '@/data/emissions'

export function useEmissions(): Emission[] {
  const [data, setData] = useState<Emission[]>(EMISSIONS)

  useEffect(() => {
    let cancelled = false
    const load = (attempt = 1) => {
      fetch('/api/emissions', { cache: 'no-store' })
        .then(r => (r.ok ? r.json() : null))
        .then((json: { emissions?: Emission[] } | null) => {
          if (cancelled) return
          if (json?.emissions?.length) {
            setData(json.emissions)
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
