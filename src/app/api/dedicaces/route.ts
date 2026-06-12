import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL!

export async function POST(request: NextRequest) {
  if (!WEBHOOK_URL) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }

  try {
    const body = await request.json()

    // Honeypot : un humain ne voit pas ce champ ; s'il est rempli, c'est un robot
    if (body.website) {
      return NextResponse.json({ success: true })
    }

    const { prenom, ville, pour, message, emission } = body
    if (!prenom || !ville || !pour || !message || !emission) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }

    // Google Apps Script renvoie un redirect 302 — on ne le suit pas,
    // le doPost est exécuté avant que la réponse soit envoyée
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'manual',
    })

    // 200 = succès direct, 302 = redirect Apps Script (données bien reçues)
    if (res.status !== 200 && res.status !== 302 && res.status !== 301) {
      console.error('[dedicaces] Statut inattendu:', res.status)
      throw new Error(`Statut ${res.status}`)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[dedicaces]', err)
    return NextResponse.json({ error: 'Erreur lors de l\'envoi. Réessayez.' }, { status: 500 })
  }
}
