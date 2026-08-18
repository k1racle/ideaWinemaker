import { getPublicWineBySlug } from '../../repositories/content'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') || ''
  const wine = getPublicWineBySlug(slug)
  if (!wine) throw createError({ statusCode: 404, message: 'Вино не найдено' })
  return wine
})
