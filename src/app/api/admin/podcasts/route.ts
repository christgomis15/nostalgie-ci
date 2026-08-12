import { NextResponse } from 'next/server'
import { postAdminAction } from '@/lib/admin-webhook'

export async function POST(req: Request) {
  try {
    const { type, ...rest } = await req.json()
    const data = await postAdminAction({ type: 'admin_add_podcast', podcastType: type, ...rest })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/podcasts POST]', err)
    return NextResponse.json({ error: "Échec de l'ajout" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { type, titre } = await req.json()
    if (!titre) return NextResponse.json({ error: 'Titre manquant' }, { status: 400 })
    const data = await postAdminAction({ type: 'admin_delete_podcast', podcastType: type, titre })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/podcasts DELETE]', err)
    return NextResponse.json({ error: 'Échec de la suppression' }, { status: 500 })
  }
}
