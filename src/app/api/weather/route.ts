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

type Level = 'jaune' | 'orange' | 'rouge'
const STORM_CODES: Record<number, Level> = { 95: 'orange', 96: 'rouge', 99: 'rouge' }

const RAIN_LEVELS: [number, Level][] = [[60, 'rouge'], [40, 'orange'], [20, 'jaune']]
const WIND_LEVELS: [number, Level][] = [[80, 'rouge'], [60, 'orange'], [40, 'jaune']]

const LEVEL_RANK: Record<Level, number> = { jaune: 1, orange: 2, rouge: 3 }
const LEVEL_LABEL: Record<Level, string> = { jaune: 'Jaune', orange: 'Orange', rouge: 'Rouge' }

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

function findNowIndex(hourly: HourlyBlock): number {
  const now = Date.now()
  const idx = hourly.time.findIndex(t => new Date(t).getTime() >= now)
  return idx === -1 ? 0 : idx
}

function pickLevel(value: number, table: [number, Level][]): Level | null {
  for (const [threshold, level] of table) {
    if (value > threshold) return level
  }
  return null
}

function computeAlert(hourly: HourlyBlock): { level: Level; label: string } | null {
  const startIdx = findNowIndex(hourly)
  const precipitation = hourly.precipitation.slice(startIdx, startIdx + 6)
  const weatherCode = hourly.weather_code.slice(startIdx, startIdx + 6)
  const windSpeed = hourly.wind_speed_10m.slice(startIdx, startIdx + 6)

  const rainSum = precipitation.reduce((a, b) => a + b, 0)
  const windMax = Math.max(0, ...windSpeed)

  let best: { level: Level; label: string } | null = null
  const consider = (level: Level | null, label: string) => {
    if (!level) return
    if (!best || LEVEL_RANK[level] > LEVEL_RANK[best.level]) best = { level, label }
  }

  const stormLevel = weatherCode.reduce<Level | null>((acc, c) => {
    const lvl = STORM_CODES[c]
    if (!lvl) return acc
    if (!acc || LEVEL_RANK[lvl] > LEVEL_RANK[acc]) return lvl
    return acc
  }, null)
  consider(stormLevel, 'Orages prévus dans les prochaines heures')
  consider(pickLevel(rainSum, RAIN_LEVELS), 'Fortes pluies attendues dans les prochaines heures')
  consider(pickLevel(windMax, WIND_LEVELS), 'Vents forts attendus dans les prochaines heures')

  return best
}

function buildForecast(hourly: HourlyBlock) {
  const startIdx = findNowIndex(hourly)
  return hourly.time.slice(startIdx, startIdx + 12).map((t, i) => {
    const idx = startIdx + i
    const meta = WEATHER_LABELS[hourly.weather_code[idx]] ?? { label: 'Variable', icon: '🌡️' }
    return {
      heure: new Date(t).toISOString().slice(11, 16),
      icon: meta.icon,
      label: meta.label,
      precip: hourly.precipitation[idx],
      vent: Math.round(hourly.wind_speed_10m[idx]),
    }
  })
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
        return { ville: city.ville, temp: null, label: null, icon: null, alert: null, level: null, forecast: [] }
      }
      const meta = WEATHER_LABELS[data.current.weather_code] ?? { label: 'Variable', icon: '🌡️' }
      const alert = computeAlert(data.hourly)
      return {
        ville: city.ville,
        temp: Math.round(data.current.temperature_2m),
        label: meta.label,
        icon: meta.icon,
        alert: alert ? `Alerte ${LEVEL_LABEL[alert.level]} — ${alert.label}` : null,
        level: alert?.level ?? null,
        forecast: buildForecast(data.hourly),
      }
    })

    return Response.json({ cities })
  } catch (err) {
    console.error('weather error:', err)
    return Response.json({ cities: [] }, { status: 500 })
  }
}
