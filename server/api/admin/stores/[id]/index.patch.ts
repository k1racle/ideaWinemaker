import { updateStore } from '../../../../repositories/content'
import { updateStoreSchema } from '../../../../validation/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  assertAdminMutationRequest(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, message: 'Некорректный ID' })
  const input = await readContentBody(event, updateStoreSchema)

  try {
    const updated = updateStore(id, input)
    if (!updated) throw createError({ statusCode: 404, message: 'Точка магазина не найдена' })
    return updated
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && String(error.code).includes('SQLITE_CONSTRAINT_UNIQUE')) {
      throw createError({ statusCode: 409, message: 'Такая точка магазина уже существует' })
    }
    throw error
  }
})
