import { getPublicWinemakerBySlug } from '../../repositories/content'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') || ''
  const winemaker = getPublicWinemakerBySlug(slug)
  if (!winemaker) throw createError({ statusCode: 404, message: 'Винодел не найден' })
  return winemaker
})
