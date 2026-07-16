import { NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL!

export async function GET(req: Request) {
  if (!WEBHOOK_URL) return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  try {
    const { searchParams } = new URL(req.url)
    const start = searchParams.get('start') || ''
    const end = searchParams.get('end') || ''
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(`${WEBHOOK_URL}?action=top5archive&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`, {
      redirect: 'follow',
      cache: 'no-store',
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`Statut ${res.status}`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/top5-archive]', err)
    return NextResponse.json({ error: "Impossible de charger l'archive" }, { status: 500 })
  }
}
