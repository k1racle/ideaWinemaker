import { getAdminWineryById } from '../../../../repositories/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, message: 'Некорректный ID' })

  const winery = getAdminWineryById(id)
  if (!winery) throw createError({ statusCode: 404, message: 'Винодельня не найдена' })
  return winery
})
