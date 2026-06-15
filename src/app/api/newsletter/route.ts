import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL!

export async function POST(request: NextRequest) {
  if (!WEBHOOK_URL) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }

  try {
    const body = await request.json()

    if (body.website) {
      return NextResponse.json({ success: true })
    }

    const { email, prenom } = body
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type: 'newsletter', email, prenom: prenom || '' }),
      redirect: 'manual',
    })

    if (res.status !== 200 && res.status !== 302 && res.status !== 301) {
      throw new Error(`Statut ${res.status}`)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter]', err)
    return NextResponse.json({ error: 'Erreur lors de l\'inscription. Réessayez.' }, { status: 500 })
  }
}
