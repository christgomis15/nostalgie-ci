import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const STREAM_URL = 'http://213.136.96.14:8000/nostalgie2.mp3'

export async function GET(req: NextRequest) {
  try {
    const upstream = await fetch(STREAM_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NostalgieCI-Proxy/1.0)',
        'Icy-MetaData': '1',
      },
      // @ts-expect-error — Node.js fetch supports duplex streaming
      duplex: 'half',
    })

    if (!upstream.ok || !upstream.body) {
      return new Response(`Flux indisponible (${upstream.status})`, { status: 502 })
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') || 'audio/mpeg',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (err) {
    console.error('Stream proxy error:', err)
    return new Response('Erreur proxy stream', { status: 500 })
  }
}