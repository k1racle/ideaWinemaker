import { updateWinery } from '../../../../repositories/content'
import { updateWinerySchema } from '../../../../validation/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  assertAdminMutationRequest(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, message: 'Некорректный ID' })
  const input = await readContentBody(event, updateWinerySchema)

  try {
    const updated = updateWinery(id, input)
    if (!updated) throw createError({ statusCode: 404, message: 'Винодельня не найдена' })
    return updated
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && String(error.code).includes('SQLITE_CONSTRAINT_UNIQUE')) {
      throw createError({ statusCode: 409, message: 'Винодельня с таким slug уже существует' })
    }
    throw error
  }
})
