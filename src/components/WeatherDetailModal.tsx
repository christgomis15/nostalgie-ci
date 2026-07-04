'use client'

export interface CityWeatherDetail {
  ville: string
  temp: number | null
  label: string | null
  icon: string | null
  alert: string | null
  level: 'jaune' | 'orange' | 'rouge' | null
  forecast: { heure: string; icon: string; label: string; precip: number; vent: number }[]
}

export default function WeatherDetailModal({ city, onClose }: { city: CityWeatherDetail; onClose: () => void }) {
  return (
    <div className="wthr-modal-overlay" onClick={onClose}>
      <div className="wthr-modal" onClick={e => e.stopPropagation()}>
        <button className="wthr-modal-close" onClick={onClose} aria-label="Fermer">✕</button>

        <div className="wthr-modal-head">
          <span className="wthr-modal-icon">{city.icon ?? '🌡️'}</span>
          <div>
            <h3 className="wthr-modal-ville">{city.ville}</h3>
            <p className="wthr-modal-label">{city.label ?? 'Données indisponibles'}</p>
          </div>
          <span className="wthr-modal-temp">{city.temp !== null ? `${city.temp}°C` : '—'}</span>
        </div>

        {city.alert && (
          <div className={`wthr-modal-alert wthr-modal-alert-${city.level}`}>
            ⚠️ {city.alert}
          </div>
        )}

        {city.forecast.length > 0 && (
          <div className="wthr-modal-forecast">
            <p className="wthr-modal-forecast-title">Prochaines heures</p>
            <div className="wthr-modal-forecast-row">
              {city.forecast.map(f => (
                <div key={f.heure} className="wthr-modal-forecast-item">
                  <p className="wthr-modal-forecast-h">{f.heure}</p>
                  <p className="wthr-modal-forecast-icon">{f.icon}</p>
                  <p className="wthr-modal-forecast-precip">{f.precip > 0 ? `${f.precip.toFixed(1)}mm` : '—'}</p>
                  <p className="wthr-modal-forecast-vent">{f.vent}km/h</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
