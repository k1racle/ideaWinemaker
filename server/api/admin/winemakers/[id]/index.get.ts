import { getAdminWinemakerById } from '../../../../repositories/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, message: 'Некорректный ID' })

  const winemaker = getAdminWinemakerById(id)
  if (!winemaker) throw createError({ statusCode: 404, message: 'Винодел не найден' })
  return winemaker
})
