import type { PublicSiteDocumentKey } from '../../../shared/types/site-content'
import { getPublicSiteDocument } from '../../repositories/site-content'

const documentKeys: PublicSiteDocumentKey[] = ['site', 'pages', 'partners', 'policies', 'news', 'events']

export default defineEventHandler((event) => {
  const document = getRouterParam(event, 'document')
  if (!documentKeys.includes(document as PublicSiteDocumentKey)) {
    throw createError({ statusCode: 404, statusMessage: 'Документ контента не найден' })
  }

  return getPublicSiteDocument(document as PublicSiteDocumentKey)
})
