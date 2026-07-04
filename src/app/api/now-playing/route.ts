export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const STATUS_URL = 'http://213.136.96.14:8000/status-json.xsl'
const FALLBACK_TITLES = ['NOSTALGIE ABIDJAN N°1', 'NOSTALGIE ABIDJAN N°1']

interface IcecastSource {
  title?: string
  listenurl?: string
}

function pickSource(source: IcecastSource | IcecastSource[] | undefined): IcecastSource | null {
  if (!source) return null
  if (Array.isArray(source)) {
    return source.find(s => s.listenurl?.includes('nostalgie2.mp3')) ?? source[0] ?? null
  }
  return source
}

export async function GET() {
  try {
    const res = await fetch(STATUS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
      cache: 'no-store',
    })
    if (!res.ok) {
      return Response.json({ isLive: false, artist: null, title: null })
    }

    const data = await res.json()
    const source = pickSource(data?.icestats?.source)
    const rawTitle = source?.title?.trim()

    if (!rawTitle || FALLBACK_TITLES.includes(rawTitle)) {
      return Response.json({ isLive: false, artist: null, title: null })
    }

    const sepMatch = rawTitle.match(/^(.+?)\s+-\s+(.+)$/)
    if (sepMatch) {
      return Response.json({ isLive: true, artist: sepMatch[1].trim(), title: sepMatch[2].trim() })
    }
    return Response.json({ isLive: true, artist: null, title: rawTitle })
  } catch (err) {
    console.error('now-playing error:', err)
    return Response.json({ isLive: false, artist: null, title: null })
  }
}
