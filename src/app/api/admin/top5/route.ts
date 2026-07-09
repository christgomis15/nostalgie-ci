import { NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL!

export async function POST(req: Request) {
  if (!WEBHOOK_URL) return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  try {
    const body = await req.json()
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type: 'admin_update_top5', ...body }),
      redirect: 'follow',
    })
    if (!res.ok) throw new Error(`Statut ${res.status}`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/top5 POST]', err)
    return NextResponse.json({ error: 'Échec de la mise à jour' }, { status: 500 })
  }
}
