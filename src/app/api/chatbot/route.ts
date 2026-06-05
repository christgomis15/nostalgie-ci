import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de Radio Nostalgie CI, la première radio commerciale privée de Côte d'Ivoire.
Tu diffuses sur 101.1 FM à Abidjan et sur plusieurs fréquences régionales.
Tu réponds aux auditeurs de manière chaleureuse, en français, avec le ton décontracté et décalé de la radio.
Slogan : "Sérieusement Décalée."

Tu peux aider avec :
- Les informations sur les émissions et les animateurs
- Les horaires de diffusion
- Les dédicaces et demandes musicales
- Les informations de contact (commercial : commercial@nostalgie.ci, marketing : +225 20 21 85 50)
- Les questions générales sur la radio

Garde tes réponses courtes et dynamiques, comme un DJ en direct. Maximum 3-4 phrases.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages requis' }, { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages,
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Réponse invalide' }, { status: 500 })
    }

    return NextResponse.json({ reply: content.text })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}