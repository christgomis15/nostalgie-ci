import { LOCALE, INTERNATIONALE, EVENTS, POTINS, type Article } from '@/data/actus'
import { slugify } from '@/lib/slugify'

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL

export async function getAllActus(): Promise<Article[]> {
  if (WEBHOOK_URL) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 6000)
      const res = await fetch(`${WEBHOOK_URL}?action=actus`, {
        redirect: 'follow',
        next: { revalidate: 300 },
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (res.ok) {
        const data = await res.json()
        if (data?.articles?.length) return data.articles as Article[]
      }
    } catch {
      // on retombe sur le contenu de secours ci-dessous
    }
  }
  return [...LOCALE, ...INTERNATIONALE, ...EVENTS, ...POTINS]
}

export async function getActuBySlug(slug: string): Promise<Article | null> {
  const articles = await getAllActus()
  return articles.find(a => slugify(a.title) === slug) ?? null
}
