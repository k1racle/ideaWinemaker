import { createStore } from '../../../repositories/content'
import { createStoreSchema } from '../../../validation/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  assertAdminMutationRequest(event)
  const input = await readContentBody(event, createStoreSchema)

  try {
    const created = createStore(input)
    setResponseStatus(event, 201)
    return created
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && String(error.code).includes('SQLITE_CONSTRAINT_UNIQUE')) {
      throw createError({ statusCode: 409, message: 'Такая точка магазина уже существует' })
    }
    throw error
  }
})
