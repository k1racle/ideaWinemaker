import type { Store, Terroir, Wine, Winemaker } from '~~/shared/types/content'

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
