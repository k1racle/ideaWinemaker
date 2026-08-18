import { listPublicWines } from '../../repositories/content'

const asString = (value: unknown) => typeof value === 'string' ? value : undefined

export default defineEventHandler((event) => {
  const query = getQuery(event)
  return listPublicWines({
    year: asString(query.year),
    terroir: asString(query.terroir),
    winemaker: asString(query.winemaker),
    method: asString(query.method),
  })
})
