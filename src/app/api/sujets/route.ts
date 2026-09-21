import { NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL!

export async function GET(req: Request) {
  if (!WEBHOOK_URL) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }
  // ?fresh=1 : utilisé par /admin/sujets, qui doit voir immédiatement un sujet
  // qu'on vient de publier (sinon on croit que la publication a échoué et on
  // republie en double). Côté public, cache très court : un sujet posté en
  // direct pendant l'émission doit apparaître en quelques secondes, pas minutes.
  const fresh = new URL(req.url).searchParams.get('fresh') === '1'
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)
    const res = await fetch(`${WEBHOOK_URL}?action=sujets`, {
      redirect: 'follow',
      ...(fresh ? { cache: 'no-store' as const } : { next: { revalidate: 20 } }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`Statut ${res.status}`)
    const data = await res.json()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': fresh ? 'no-store' : 'public, s-maxage=20, stale-while-revalidate=40',
      },
    })
  } catch (err) {
    console.error('[sujets]', err)
    return NextResponse.json({ error: 'Impossible de charger les sujets' }, { status: 500 })
  }
}
