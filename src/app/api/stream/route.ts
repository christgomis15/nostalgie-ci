export const runtime = 'edge'

const UPSTREAM = 'http://213.136.96.14:8000/nostalgie2.mp3'

export async function GET() {
  const upstream = await fetch(UPSTREAM, {
    headers: { 'Icy-MetaData': '1', 'User-Agent': 'Mozilla/5.0' },
  })

  return new Response(upstream.body, {
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'audio/mpeg',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
      'Transfer-Encoding': 'chunked',
    },
  })
}
