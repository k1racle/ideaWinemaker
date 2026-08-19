import { updateTerroir } from '../../../../repositories/content'
import { updateTerroirSchema } from '../../../../validation/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  assertAdminMutationRequest(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, message: 'Некорректный ID' })
  const input = await readContentBody(event, updateTerroirSchema)

  try {
    const updated = updateTerroir(id, input)
    if (!updated) throw createError({ statusCode: 404, message: 'Терруар не найден' })
    return updated
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && String(error.code).includes('SQLITE_CONSTRAINT_UNIQUE')) {
      throw createError({ statusCode: 409, message: 'Терруар с таким slug или кодом уже существует' })
    }
    throw error
  }
})
