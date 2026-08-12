import type { MetadataRoute } from 'next'
import { getAllActus } from '@/lib/actus-server'
import { slugify } from '@/lib/slugify'

const BASE_URL = 'https://www.nostalgie.ci'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'hourly', priority: 1 },
    { url: `${BASE_URL}/actus`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/emissions`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/podcasts`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/live`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/dedicaces`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/reserver`, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const articles = await getAllActus()
  const seen = new Set<string>()
  const actuRoutes: MetadataRoute.Sitemap = []
  for (const a of articles) {
    const slug = slugify(a.title)
    if (!slug || seen.has(slug)) continue
    seen.add(slug)
    actuRoutes.push({
      url: `${BASE_URL}/actus/${slug}`,
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  }

  return [...staticRoutes, ...actuRoutes]
}
