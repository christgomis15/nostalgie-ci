import { NextResponse } from 'next/server'
import { postAdminAction } from '@/lib/admin-webhook'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = await postAdminAction({ type: 'admin_add_actus', ...body })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/actus POST]', err)
    return NextResponse.json({ error: "Échec de l'ajout" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { title } = await req.json()
    if (!title) return NextResponse.json({ error: 'Titre manquant' }, { status: 400 })
    const data = await postAdminAction({ type: 'admin_delete_actus', title })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/actus DELETE]', err)
    return NextResponse.json({ error: 'Échec de la suppression' }, { status: 500 })
  }
}
