import { NextResponse } from 'next/server'
import { postAdminAction } from '@/lib/admin-webhook'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body.titre?.trim()) return NextResponse.json({ error: 'Titre manquant' }, { status: 400 })
    const data = await postAdminAction({ type: 'admin_add_sujet', ...body })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/sujets POST]', err)
    return NextResponse.json({ error: "Échec de l'ajout" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { titre } = await req.json()
    if (!titre) return NextResponse.json({ error: 'Titre manquant' }, { status: 400 })
    const data = await postAdminAction({ type: 'admin_delete_sujet', titre })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/sujets DELETE]', err)
    return NextResponse.json({ error: 'Échec de la suppression' }, { status: 500 })
  }
}
