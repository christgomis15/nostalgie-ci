import { NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL!

export async function GET(req: Request) {
  if (!WEBHOOK_URL) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }
  // ?fresh=1 : utilisé par le compositeur de newsletter, qui a besoin de données
  // garanties à jour (pas de cache de 5 min) juste après une mise à jour dans /admin.
  const fresh = new URL(req.url).searchParams.get('fresh') === '1'
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)
    const res = await fetch(`${WEBHOOK_URL}?action=emissions`, {
      redirect: 'follow',
      ...(fresh ? { cache: 'no-store' as const } : { next: { revalidate: 300 } }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`Statut ${res.status}`)
    const data = await res.json()
    if (!data?.emissions?.length) throw new Error('Données vides')
    return NextResponse.json(data, {
      headers: { 'Cache-Control': fresh ? 'no-store' : 'public, s-maxage=300, stale-while-revalidate=3600' },
    })
  } catch (err) {
    console.error('[emissions]', err)
    return NextResponse.json({ error: 'Impossible de charger les émissions' }, { status: 500 })
  }
}
