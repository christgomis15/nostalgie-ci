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
    fetch('/api/top5')
      .then(r => (r.ok ? r.json() : null))
      .then((json: Top5Data | null) => {
        if (json?.items?.length) setData(json)
      })
      .catch(() => {})
  }, [])

  return data
}
