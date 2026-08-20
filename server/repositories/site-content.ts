import type { PublicSiteContent, PublicSiteDocumentKey, PublicSiteDocumentMap } from '../../shared/types/site-content'
import { openInitialContentDatabase } from '../database/connection'

interface SiteDocumentRow {
  data: string
}

const documentCache = new Map<PublicSiteDocumentKey, PublicSiteDocumentMap[PublicSiteDocumentKey]>()

export const getPublicSiteDocument = <Key extends PublicSiteDocumentKey>(key: Key): PublicSiteDocumentMap[Key] => {
  const cachedDocument = documentCache.get(key) as PublicSiteDocumentMap[Key] | undefined
  if (cachedDocument) return cachedDocument

  const sqlite = openInitialContentDatabase()
  let row: SiteDocumentRow | undefined
  try {
    row = sqlite.prepare('SELECT data FROM site_documents WHERE key = ?')
      .get(key) as SiteDocumentRow | undefined
  } finally {
    sqlite.close()
  }

  if (!row) throw new Error(`В базовой SQLite отсутствует документ ${key}`)

  try {
    const document = JSON.parse(row.data) as PublicSiteDocumentMap[Key]
    documentCache.set(key, document)
    return document
  } catch (error) {
    throw new Error(`Не удалось прочитать ${key} из базовой SQLite`, { cause: error })
  }
}

export const getPublicSiteContent = (): PublicSiteContent => ({
  site: getPublicSiteDocument('site'),
  pages: getPublicSiteDocument('pages'),
  partners: getPublicSiteDocument('partners'),
  policies: getPublicSiteDocument('policies'),
  news: getPublicSiteDocument('news'),
  events: getPublicSiteDocument('events'),
})
