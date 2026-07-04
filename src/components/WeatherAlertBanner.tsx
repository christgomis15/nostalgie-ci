'use client'

import { useEffect, useState } from 'react'
import WeatherDetailModal, { type CityWeatherDetail } from '@/components/WeatherDetailModal'

const STORAGE_KEY = 'weather-alert-dismissed'

export default function WeatherAlertBanner() {
  const [alerts, setAlerts] = useState<CityWeatherDetail[]>([])
  const [dismissed, setDismissed] = useState(false)
  const [selected, setSelected] = useState<CityWeatherDetail | null>(null)

  useEffect(() => {
    let cancelled = false
    const check = () => {
      fetch('/api/weather', { cache: 'no-store' })
        .then(res => res.json())
        .then((data: { cities: CityWeatherDetail[] }) => {
          if (cancelled) return
          const active = (data.cities ?? []).filter(c => !!c.alert)
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
    <>
      <div className="wthr-banner">
        <span className="wthr-banner-icon">⚠️</span>
        <span className="wthr-banner-text">
          {alerts.map((a, i) => (
            <span key={a.ville}>
              {i > 0 && ' · '}
              <button className="wthr-banner-ville" onClick={() => setSelected(a)}>{a.ville}</button>
              {' — '}{a.alert}
            </span>
          ))}
        </span>
        <button className="wthr-banner-close" onClick={dismiss} aria-label="Fermer">✕</button>
      </div>

      {selected && <WeatherDetailModal city={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
