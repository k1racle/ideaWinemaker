import { getPublicTerroirBySlug } from '../../repositories/content'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') || ''
  const terroir = getPublicTerroirBySlug(slug)
  if (!terroir) throw createError({ statusCode: 404, message: 'Терруар не найден' })
  return terroir
})
