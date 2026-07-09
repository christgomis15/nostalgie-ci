import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'Stockage image non configuré (BLOB_READ_WRITE_TOKEN manquant)' }, { status: 500 })
  }
  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 })
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 })
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image trop volumineuse (8 Mo max)' }, { status: 400 })
    }

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const safeExt = /^[a-z0-9]{2,5}$/.test(ext) ? ext : 'jpg'
    const filename = `actus/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`

    const blob = await put(filename, file, { access: 'public' })
    return NextResponse.json({ url: blob.url })
  } catch (err) {
    console.error('[admin/upload]', err)
    return NextResponse.json({ error: "Échec de l'upload" }, { status: 500 })
  }
}
