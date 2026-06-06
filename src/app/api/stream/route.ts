export const runtime = 'edge'

const UPSTREAM = 'http://213.136.96.14:8000/nostalgie2.mp3'

export async function GET() {
  try {
    const upstream = await fetch(UPSTREAM, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })

    if (!upstream.ok || !upstream.body) {
      return new Response(`Upstream error: ${upstream.status} ${upstream.statusText}`, { status: 502 })
    }

    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache, no-store',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    return new Response(`Proxy error: ${String(err)}`, { status: 500 })
  }
}
