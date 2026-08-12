import { NextResponse } from 'next/server'
import { postAdminAction } from '@/lib/admin-webhook'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = await postAdminAction({ type: 'admin_update_live', ...body })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/live POST]', err)
    return NextResponse.json({ error: 'Échec de la mise à jour' }, { status: 500 })
  }
}
