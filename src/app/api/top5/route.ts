import { NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL!

// Revalide toutes les heures (le site recharge les données sans redéploiement)
export const revalidate = 3600

export async function GET() {
  if (!WEBHOOK_URL) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }
  try {
    const res = await fetch(`${WEBHOOK_URL}?action=top5`, { redirect: 'follow' })
    if (!res.ok) throw new Error(`Statut ${res.status}`)
    const data = await res.json()
    if (!data?.items?.length) throw new Error('Données vides')
    return NextResponse.json(data)
  } catch (err) {
    console.error('[top5]', err)
    return NextResponse.json({ error: 'Impossible de charger le Top 5' }, { status: 500 })
  }
}
