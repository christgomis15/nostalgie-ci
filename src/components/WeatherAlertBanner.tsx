'use client'

import { useEffect, useState } from 'react'

interface CityWeather {
  ville: string
  alert: string | null
}

const STORAGE_KEY = 'weather-alert-dismissed'

export default function WeatherAlertBanner() {
  const [alerts, setAlerts] = useState<{ ville: string; alert: string }[]>([])
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const check = () => {
      fetch('/api/weather', { cache: 'no-store' })
        .then(res => res.json())
        .then((data: { cities: CityWeather[] }) => {
          if (cancelled) return
          const active = (data.cities ?? [])
            .filter((c): c is { ville: string; alert: string } => !!c.alert)
          setAlerts(active)

          const signature = active.map(a => `${a.ville}:${a.alert}`).join('|')
          const dismissedSignature = sessionStorage.getItem(STORAGE_KEY)
          setDismissed(signature !== '' && signature === dismissedSignature)
        })
        .catch(() => {})
    }
    check()
    const id = setInterval(check, 15 * 60 * 1000)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  function dismiss() {
    const signature = alerts.map(a => `${a.ville}:${a.alert}`).join('|')
    sessionStorage.setItem(STORAGE_KEY, signature)
    setDismissed(true)
  }

  if (alerts.length === 0 || dismissed) return null

  return (
    <div className="wthr-banner">
      <span className="wthr-banner-icon">⚠️</span>
      <span className="wthr-banner-text">
        {alerts.map((a, i) => (
          <span key={a.ville}>
            {i > 0 && ' · '}
            <strong>{a.ville}</strong> — {a.alert}
          </span>
        ))}
      </span>
      <button className="wthr-banner-close" onClick={dismiss} aria-label="Fermer">✕</button>
    </div>
  )
}
