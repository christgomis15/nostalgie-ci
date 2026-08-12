import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getActuBySlug } from '@/lib/actus-server'
import { parseFrenchDate } from '@/lib/date-fr'
import ActuDetailClient from './ActuDetailClient'

const SITE_URL = 'https://www.nostalgie.ci'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getActuBySlug(slug)
  if (!article) return { title: 'Article introuvable' }

  const url = `${SITE_URL}/actus/${slug}`
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      type: 'article',
      images: [{ url: article.img }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  }
}

export default async function ActuDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getActuBySlug(slug)
  if (!article) notFound()

  const url = `${SITE_URL}/actus/${slug}`
  const timestamp = parseFrenchDate(article.date)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: [article.img],
    ...(timestamp ? { datePublished: new Date(timestamp).toISOString() } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'Nostalgie CI' },
    publisher: {
      '@type': 'Organization',
      name: 'Nostalgie CI',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/img/nostalgie-logo.png` },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ActuDetailClient article={article} shareUrl={url} />
    </>
  )
}
