import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL!
const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_LIST_ID = 3

async function addToBrevo(email: string, prenom: string) {
  if (!BREVO_API_KEY) return
  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      email,
      attributes: prenom ? { PRENOM: prenom } : undefined,
      listIds: [BREVO_LIST_ID],
      updateEnabled: true,
    }),
  })
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.message || `Statut Brevo ${res.status}`)
  }
}

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

    try {
      await addToBrevo(email, prenom || '')
    } catch (brevoErr) {
      console.error('[newsletter] Brevo sync failed', brevoErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter]', err)
    return NextResponse.json({ error: 'Erreur lors de l\'inscription. Réessayez.' }, { status: 500 })
  }
}
