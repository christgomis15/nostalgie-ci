'use client'

import { useEffect, useState } from 'react'

interface CityWeather {
  ville: string
  temp: number | null
  label: string | null
  icon: string | null
  alert: string | null
}

export default function WeatherWidget() {
  const [cities, setCities] = useState<CityWeather[]>([])

  useEffect(() => {
    let cancelled = false
    fetch('/api/weather', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => { if (!cancelled) setCities(data.cities ?? []) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  if (cities.length === 0) return null

  return (
    <section className="wthr-section">
      <div className="wthr-inner">
        <p className="section-label">En direct du ciel</p>
        <div className="wthr-row">
          {cities.map(c => (
            <div key={c.ville} className={`wthr-chip ${c.alert ? 'wthr-alert' : ''}`}>
              <span className="wthr-icon">{c.icon ?? '🌡️'}</span>
              <div>
                <p className="wthr-ville">{c.ville}</p>
                <p className="wthr-temp">{c.temp !== null ? `${c.temp}°C` : '—'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
