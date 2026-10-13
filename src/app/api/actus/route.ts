import { NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL!

export async function GET(req: Request) {
  if (!WEBHOOK_URL) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }
  // ?fresh=1 : utilisé par /admin/actus, qui doit voir immédiatement un article
  // qu'on vient de publier ou de corriger (sinon on croit que ça a échoué).
  const fresh = new URL(req.url).searchParams.get('fresh') === '1'
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)
    const res = await fetch(`${WEBHOOK_URL}?action=actus`, {
      redirect: 'follow',
      ...(fresh ? { cache: 'no-store' as const } : { next: { revalidate: 300 } }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`Statut ${res.status}`)
    const data = await res.json()
    if (!data?.articles?.length) throw new Error('Données vides')
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': fresh ? 'no-store' : 'public, s-maxage=300, stale-while-revalidate=3600',
      },
    })
  } catch (err) {
    console.error('[actus]', err)
    return NextResponse.json({ error: 'Impossible de charger les actus' }, { status: 500 })
  }
}
