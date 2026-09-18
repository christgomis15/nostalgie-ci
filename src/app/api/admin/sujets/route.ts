import { NextResponse } from 'next/server'
import { postAdminAction } from '@/lib/admin-webhook'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL

const norm = (s: string) => s.trim().toLowerCase()

// Rend `titre` unique par rapport à la liste `pris` (titres déjà normalisés),
// en ajoutant le suffixe donné, puis un compteur si besoin.
function renduUnique(titre: string, suffixe: string, pris: Set<string>): string {
  if (!pris.has(norm(titre))) return titre
  let candidat = `${titre}${suffixe}`
  let n = 2
  while (pris.has(norm(candidat))) {
    candidat = `${titre}${suffixe} (${n})`
    n++
  }
  return candidat
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body.titre?.trim()) return NextResponse.json({ error: 'Titre manquant' }, { status: 400 })

    let titre = String(body.titre).trim()
    let renomme = false

    // Un titre de sujet sert aussi de clé pour les J'aime/commentaires et pour
    // la suppression (qui retire la 1ère ligne au titre correspondant) — un
    // doublon (ex. segment récurrent "Gamme d'auditeurs" republié chaque
    // semaine) peut donc faire disparaître ou mélanger la mauvaise édition.
    // On rend le titre unique automatiquement plutôt que de compter sur
    // l'admin pour y penser à chaque publication.
    if (WEBHOOK_URL) {
      try {
        const res = await fetch(`${WEBHOOK_URL}?action=sujets`, { cache: 'no-store' })
        if (res.ok) {
          const existing = await res.json()
          const pris = new Set<string>((existing.sujets || []).map((s: { titre: string }) => norm(s.titre)))
          if (pris.has(norm(titre))) {
            const suffixe = body.date?.trim() ? ` — ${String(body.date).trim()}` : ` — ${new Date().toLocaleDateString('fr-FR')}`
            titre = renduUnique(titre, suffixe, pris)
            renomme = true
          }
        }
      } catch {
        // Vérification indisponible : on publie quand même avec le titre tel quel
        // plutôt que de bloquer la publication pour un aléa réseau.
      }
    }

    const data = await postAdminAction({ type: 'admin_add_sujet', ...body, titre })
    return NextResponse.json({ ...(typeof data === 'object' && data ? data : {}), titre, renomme })
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
