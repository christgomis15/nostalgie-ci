import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL!

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get('videoId')
  if (!videoId) return NextResponse.json({ likes: 0, comments: [] })

  try {
    // Chaque appel à Apps Script coûte 2-6s à lui seul (latence propre à ce
    // service, indépendante de la taille des données depuis le 7 oct.) —
    // un court cache ici évite de la payer à chaque poll (toutes les 20s
    // côté site) ou pour chaque visiteur simultané.
    const res = await fetch(
      `${WEBHOOK_URL}?action=interactions&videoId=${encodeURIComponent(videoId)}`,
      { redirect: 'follow', next: { revalidate: 10 } }
    )
    if (!res.ok) throw new Error(`Statut ${res.status}`)
    const data = await res.json()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=20' },
    })
  } catch {
    return NextResponse.json({ likes: 0, comments: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.videoId || !body.type) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }
    if (body.type === 'comment' && !body.commentaire?.trim()) {
      return NextResponse.json({ error: 'Commentaire vide' }, { status: 400 })
    }

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
    console.error('[interactions]', err)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
