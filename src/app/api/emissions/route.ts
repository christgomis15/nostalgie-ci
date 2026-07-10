import { NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL!

export async function GET() {
  if (!WEBHOOK_URL) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)
    const res = await fetch(`${WEBHOOK_URL}?action=emissions`, {
      redirect: 'follow',
      next: { revalidate: 300 },
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`Statut ${res.status}`)
    const data = await res.json()
    if (!data?.emissions?.length) throw new Error('Données vides')
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' },
    })
  } catch (err) {
    console.error('[emissions]', err)
    return NextResponse.json({ error: 'Impossible de charger les émissions' }, { status: 500 })
  }
}
