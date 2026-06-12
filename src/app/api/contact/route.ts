import { NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL!

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'manual',
    })
    if (res.status !== 200 && res.status !== 302 && res.status !== 301) {
      throw new Error(`Statut ${res.status}`)
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact webhook error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
