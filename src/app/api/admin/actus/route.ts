import { NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL!
const WEBHOOK_SECRET = process.env.GOOGLE_SHEET_WEBHOOK_SECRET

async function forward(payload: object) {
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...payload, secret: WEBHOOK_SECRET }),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`Statut ${res.status}`)
  return res.json()
}

export async function POST(req: Request) {
  if (!WEBHOOK_URL) return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  try {
    const body = await req.json()
    const data = await forward({ type: 'admin_add_actus', ...body })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/actus POST]', err)
    return NextResponse.json({ error: "Échec de l'ajout" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  if (!WEBHOOK_URL) return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  try {
    const { title } = await req.json()
    if (!title) return NextResponse.json({ error: 'Titre manquant' }, { status: 400 })
    const data = await forward({ type: 'admin_delete_actus', title })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/actus DELETE]', err)
    return NextResponse.json({ error: 'Échec de la suppression' }, { status: 500 })
  }
}
