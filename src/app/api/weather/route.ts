import { WEATHER_CITIES } from '@/data/weather-cities'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

const WEATHER_LABELS: Record<number, { label: string; icon: string }> = {
  0: { label: 'Ciel dégagé', icon: '☀️' },
  1: { label: 'Plutôt dégagé', icon: '🌤️' },
  2: { label: 'Partiellement nuageux', icon: '⛅' },
  3: { label: 'Couvert', icon: '☁️' },
  45: { label: 'Brume', icon: '🌫️' },
  48: { label: 'Brouillard givrant', icon: '🌫️' },
  51: { label: 'Bruine légère', icon: '🌦️' },
  53: { label: 'Bruine', icon: '🌦️' },
  55: { label: 'Bruine dense', icon: '🌦️' },
  61: { label: 'Pluie légère', icon: '🌧️' },
  63: { label: 'Pluie modérée', icon: '🌧️' },
  65: { label: 'Pluie forte', icon: '🌧️' },
  80: { label: 'Averses légères', icon: '🌦️' },
  81: { label: 'Averses modérées', icon: '🌧️' },
  82: { label: 'Averses violentes', icon: '⛈️' },
  95: { label: 'Orage', icon: '⛈️' },
  96: { label: 'Orage avec grêle', icon: '⛈️' },
  99: { label: 'Orage violent avec grêle', icon: '⛈️' },
}

const RAIN_ALERT_MM_6H = 20
const RAIN_ALERT_MM_1H = 15
const WIND_ALERT_KMH = 40
const STORM_CODES = new Set([95, 96, 99])

interface HourlyBlock {
  time: string[]
  precipitation: number[]
  weather_code: number[]
  wind_speed_10m: number[]
}
interface CurrentBlock {
  temperature_2m: number
  weather_code: number
  precipitation: number
  wind_speed_10m: number
}
interface OpenMeteoResponse {
  current: CurrentBlock
  hourly: HourlyBlock
}

function next6h(hourly: HourlyBlock) {
  const now = Date.now()
  let startIdx = hourly.time.findIndex(t => new Date(t).getTime() >= now)
  if (startIdx === -1) startIdx = 0
  return {
    precipitation: hourly.precipitation.slice(startIdx, startIdx + 6),
    weather_code: hourly.weather_code.slice(startIdx, startIdx + 6),
    wind_speed_10m: hourly.wind_speed_10m.slice(startIdx, startIdx + 6),
  }
}

function computeAlert(hourly: HourlyBlock): string | null {
  const window = next6h(hourly)
  const rainSum = window.precipitation.reduce((a, b) => a + b, 0)
  const rainMax = Math.max(0, ...window.precipitation)
  const windMax = Math.max(0, ...window.wind_speed_10m)
  const hasStorm = window.weather_code.some(c => STORM_CODES.has(c))

  if (hasStorm) return 'Orages prévus dans les prochaines heures'
  if (rainSum > RAIN_ALERT_MM_6H || rainMax > RAIN_ALERT_MM_1H) return 'Fortes pluies attendues dans les prochaines heures'
  if (windMax > WIND_ALERT_KMH) return 'Vents forts attendus dans les prochaines heures'
  return null
}

export async function GET() {
  try {
    const lat = WEATHER_CITIES.map(c => c.lat).join(',')
    const lon = WEATHER_CITIES.map(c => c.lon).join(',')
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,weather_code,precipitation,wind_speed_10m` +
      `&hourly=precipitation,weather_code,wind_speed_10m` +
      `&forecast_days=2&timezone=Africa%2FAbidjan`

    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
      return Response.json({ cities: [] }, { status: 502 })
    }

    const raw = await res.json()
    const list: OpenMeteoResponse[] = Array.isArray(raw) ? raw : [raw]

    const cities = WEATHER_CITIES.map((city, i) => {
      const data = list[i]
      if (!data?.current) {
        return { ville: city.ville, temp: null, label: null, icon: null, alert: null }
      }
      const meta = WEATHER_LABELS[data.current.weather_code] ?? { label: 'Variable', icon: '🌡️' }
      return {
        ville: city.ville,
        temp: Math.round(data.current.temperature_2m),
        label: meta.label,
        icon: meta.icon,
        alert: computeAlert(data.hourly),
      }
    })

    return Response.json({ cities })
  } catch (err) {
    console.error('weather error:', err)
    return Response.json({ cities: [] }, { status: 500 })
  }
}
