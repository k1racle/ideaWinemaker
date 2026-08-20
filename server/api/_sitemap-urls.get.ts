import type { SitemapUrlInput } from '#sitemap/types'
import { listPublicContentSitemapEntries } from '../repositories/content'
import { getPublicSiteDocument } from '../repositories/site-content'

const staticPublicUrls: SitemapUrlInput[] = [
  '/',
  '/about',
  '/events',
  '/novosti',
  '/spektakl',
  '/vinodely',
  '/wines',
]

export default defineSitemapEventHandler((): SitemapUrlInput[] => {
  const events = getPublicSiteDocument('events')
  const news = getPublicSiteDocument('news')

  return [
    ...staticPublicUrls,
    ...events.map(event => ({ loc: `/events/${event.slug}` })),
    ...news.map(post => ({
      loc: `/novosti/${post.slug}`,
      lastmod: post.publishedAt,
    })),
    ...listPublicContentSitemapEntries(),
  ]
})
