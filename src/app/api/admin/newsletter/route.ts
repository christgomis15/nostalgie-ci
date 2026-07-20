import { NextResponse } from 'next/server'
import { buildNewsletterHtml, type NewsletterData } from '@/lib/newsletter-template'

const BREVO_API_KEY = process.env.BREVO_API_KEY!
const BREVO_LIST_ID = 3
const BREVO_SENDER_ID = 1

interface RequestBody {
  data: NewsletterData
  subject: string
  previewText: string
  sendMode: 'now' | 'schedule'
  scheduledAt?: string
}

export async function POST(req: Request) {
  if (!BREVO_API_KEY) {
    return NextResponse.json({ error: 'Configuration Brevo manquante (BREVO_API_KEY)' }, { status: 500 })
  }

  try {
    const body: RequestBody = await req.json()
    const htmlContent = buildNewsletterHtml(body.data)

    const campaignPayload: Record<string, unknown> = {
      name: `Newsletter Nostalgie CI — Semaine du ${body.data.semaine}`,
      subject: body.subject,
      previewText: body.previewText,
      sender: { id: BREVO_SENDER_ID },
      htmlContent,
      recipients: { listIds: [BREVO_LIST_ID] },
    }
    if (body.sendMode === 'schedule' && body.scheduledAt) {
      campaignPayload.scheduledAt = body.scheduledAt
    }

    const createRes = await fetch('https://api.brevo.com/v3/emailCampaigns', {
      method: 'POST',
      headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(campaignPayload),
    })
    const createData = await createRes.json()
    if (!createRes.ok) {
      throw new Error(createData?.message || `Statut ${createRes.status}`)
    }
    const campaignId = createData.id

    if (body.sendMode === 'now') {
      const sendRes = await fetch(`https://api.brevo.com/v3/emailCampaigns/${campaignId}/sendNow`, {
        method: 'POST',
        headers: { 'api-key': BREVO_API_KEY, Accept: 'application/json' },
      })
      if (!sendRes.ok) {
        const sendData = await sendRes.json().catch(() => ({}))
        throw new Error(sendData?.message || `Échec de l'envoi (statut ${sendRes.status})`)
      }
    }

    return NextResponse.json({ success: true, campaignId, mode: body.sendMode })
  } catch (err) {
    console.error('[admin/newsletter]', err)
    const detail = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Échec : ${detail}` }, { status: 500 })
  }
}

export async function GET() {
  if (!BREVO_API_KEY) {
    return NextResponse.json({ error: 'Configuration Brevo manquante (BREVO_API_KEY)' }, { status: 500 })
  }
  try {
    const res = await fetch('https://api.brevo.com/v3/contacts/lists/' + BREVO_LIST_ID, {
      headers: { 'api-key': BREVO_API_KEY, Accept: 'application/json' },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.message || `Statut ${res.status}`)
    return NextResponse.json({ subscribers: data.uniqueSubscribers ?? data.totalSubscribers ?? 0 })
  } catch (err) {
    console.error('[admin/newsletter GET]', err)
    return NextResponse.json({ error: 'Impossible de vérifier Brevo' }, { status: 500 })
  }
}
