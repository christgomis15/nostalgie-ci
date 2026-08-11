import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  // Le SDK accepte soit un token statique (BLOB_READ_WRITE_TOKEN), soit
  // l'authentification OIDC (BLOB_STORE_ID + VERCEL_OIDC_TOKEN, ce dernier
  // étant injecté automatiquement par Vercel en production — il n'apparaît
  // jamais dans la liste des variables d'environnement du dashboard).
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    return NextResponse.json({ error: "Stockage image non configuré (connectez un Blob store au projet)" }, { status: 500 })
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
    // Vercel rejette les requêtes au-delà d'environ 4,5 Mo directement au niveau
    // de la plateforme (avant même d'exécuter ce code), avec une réponse qui
    // n'est pas du JSON. On se garde donc une marge de sécurité ici pour que
    // ce soit toujours ce contrôle applicatif (message clair) qui déclenche
    // en premier, jamais le rejet brut de la plateforme.
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image trop volumineuse (4 Mo max) — réduisez la taille ou compressez la photo avant de l\'envoyer' }, { status: 400 })
    }

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const safeExt = /^[a-z0-9]{2,5}$/.test(ext) ? ext : 'jpg'
    const filename = `actus/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`

    const blob = await put(filename, file, { access: 'public' })
    return NextResponse.json({ url: blob.url })
  } catch (err) {
    console.error('[admin/upload]', err)
    const detail = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Échec de l'upload : ${detail}` }, { status: 500 })
  }
}
