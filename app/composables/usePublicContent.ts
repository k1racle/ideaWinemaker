import type { Store, Terroir, Wine, Winemaker } from '~~/shared/types/content'
import type { PublicSiteDocumentKey, PublicSiteDocumentMap } from '~~/shared/types/site-content'

export const usePublicSiteDocument = async <Key extends PublicSiteDocumentKey>(document: Key) => {
  const { data, error } = await useFetch<PublicSiteDocumentMap[Key]>(`/api/site-content/${document}`, {
    key: `public-site-content-${document}`,
  })

  if (!data.value) {
    throw createError({
      statusCode: error.value?.statusCode || 500,
      statusMessage: 'Не удалось загрузить контент сайта',
    })
  }

  return data.value
}

export const usePublicWines = () => useFetch<Wine[]>('/api/wines', {
  key: 'public-wines',
  default: () => [],
})

export const usePublicWinemakers = () => useFetch<Winemaker[]>('/api/winemakers', {
  key: 'public-winemakers',
  default: () => [],
})

export const usePublicTerroirs = () => useFetch<Terroir[]>('/api/terroirs', {
  key: 'public-terroirs',
  default: () => [],
})

export const usePublicStores = () => useFetch<Store[]>('/api/stores', {
  key: 'public-stores',
  default: () => [],
})
