export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const STREAM_URL = 'http://213.136.96.14:8000/nostalgie2.mp3'

export async function GET() {
  try {
    const upstream = await fetch(STREAM_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible)',
        'Accept': 'audio/mpeg, audio/*',
      },
    })

    if (!upstream.ok || !upstream.body) {
      return new Response(`Flux indisponible (${upstream.status})`, { status: 502 })
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache, no-store',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    console.error('Stream proxy error:', err)
    return new Response('Erreur proxy stream', { status: 500 })
  }
}