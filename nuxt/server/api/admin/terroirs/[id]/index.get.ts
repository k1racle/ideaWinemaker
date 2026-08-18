import { getAdminTerroirById } from '../../../../repositories/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, message: 'Некорректный ID' })

  const terroir = getAdminTerroirById(id)
  if (!terroir) throw createError({ statusCode: 404, message: 'Терруар не найден' })
  return terroir
})
