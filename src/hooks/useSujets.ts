'use client'
import { useState, useEffect, useRef } from 'react'

export interface Sujet {
  titre: string
  emission: string
  question: string
  img: string
  date: string
}

const REFRESH_MS = 45_000

export function useSujets(): { sujets: Sujet[]; loading: boolean } {
  const [sujets, setSujets] = useState<Sujet[]>([])
  const [loading, setLoading] = useState(true)
  const lastJson = useRef('')

  useEffect(() => {
    let cancelled = false

    // Une page laissée ouverte pendant l'émission doit voir apparaître un
    // nouveau sujet sans rechargement manuel : on réinterroge régulièrement,
    // mais on ne met l'état à jour que si la liste a réellement changé.
    const apply = (list: Sujet[]) => {
      const json = JSON.stringify(list)
      if (json !== lastJson.current) {
        lastJson.current = json
        setSujets(list)
      }
      setLoading(false)
    }

    const load = (attempt = 1) => {
      fetch('/api/sujets', { cache: 'no-store' })
        .then(r => (r.ok ? r.json() : null))
        .then((json: { sujets?: Sujet[] } | null) => {
          if (cancelled) return
          if (json?.sujets) {
            apply(json.sujets)
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
    const id = setInterval(() => load(3), REFRESH_MS)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  return { sujets, loading }
}
