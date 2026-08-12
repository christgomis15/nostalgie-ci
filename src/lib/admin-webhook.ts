const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL
const WEBHOOK_SECRET = process.env.GOOGLE_SHEET_WEBHOOK_SECRET

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Le webhook Apps Script est intermittemment indisponible (infrastructure Google,
// pas notre code) : on observe parfois une erreur "Impossible d'ouvrir le fichier"
// qui se résout d'elle-même à la tentative suivante. On retente donc 2 fois avant
// d'abandonner, pour ne pas perdre une saisie admin à cause d'un simple aléa réseau.
export async function postAdminAction(payload: object, attempts = 3): Promise<unknown> {
  if (!WEBHOOK_URL) throw new Error('Configuration manquante')
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...payload, secret: WEBHOOK_SECRET }),
        redirect: 'follow',
      })
      if (!res.ok) throw new Error(`Statut ${res.status}`)
      return await res.json()
    } catch (err) {
      lastErr = err
      if (i < attempts - 1) await delay(700 * (i + 1))
    }
  }
  throw lastErr
}
