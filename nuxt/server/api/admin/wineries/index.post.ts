import { createWinery } from '../../../repositories/content'
import { createWinerySchema } from '../../../validation/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  assertAdminMutationRequest(event)
  const input = await readContentBody(event, createWinerySchema)

  try {
    const created = createWinery(input)
    setResponseStatus(event, 201)
    return created
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && String(error.code).includes('SQLITE_CONSTRAINT_UNIQUE')) {
      throw createError({ statusCode: 409, message: 'Винодельня с таким slug уже существует' })
    }
    throw error
  }
})
