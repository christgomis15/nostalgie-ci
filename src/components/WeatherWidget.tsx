'use client'

import { useEffect, useState } from 'react'
import WeatherDetailModal, { type CityWeatherDetail } from '@/components/WeatherDetailModal'

export default function WeatherWidget() {
  const [cities, setCities] = useState<CityWeatherDetail[]>([])
  const [selected, setSelected] = useState<CityWeatherDetail | null>(null)

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
            <button
              key={c.ville}
              className={`wthr-chip ${c.alert ? `wthr-alert wthr-alert-${c.level}` : ''}`}
              onClick={() => setSelected(c)}
            >
              <span className="wthr-icon">{c.icon ?? '🌡️'}</span>
              <div>
                <p className="wthr-ville">{c.ville}</p>
                <p className="wthr-temp">{c.temp !== null ? `${c.temp}°C` : '—'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && <WeatherDetailModal city={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
