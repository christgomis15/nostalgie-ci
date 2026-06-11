import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL!

export async function POST(request: NextRequest) {
  if (!WEBHOOK_URL) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }

  try {
    const body = await request.json()

    const { prenom, ville, pour, message, emission } = body
    if (!prenom || !ville || !pour || !message || !emission) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }

    // Google Apps Script nécessite text/plain pour éviter les problèmes CORS/redirect
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow',
    })

    if (!res.ok) {
      throw new Error(`Apps Script responded ${res.status}`)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[dedicaces]', err)
    return NextResponse.json({ error: 'Erreur lors de l\'envoi. Réessayez.' }, { status: 500 })
  }
}
