import { getAdminWineById } from '../../../../repositories/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, message: 'Некорректный ID' })

  const wine = getAdminWineById(id)
  if (!wine) throw createError({ statusCode: 404, message: 'Вино не найдено' })
  return wine
})
