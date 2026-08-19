import { createTerroir } from '../../../repositories/content'
import { createTerroirSchema } from '../../../validation/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  assertAdminMutationRequest(event)
  const input = await readContentBody(event, createTerroirSchema)
  try {
    const created = createTerroir(input)
    setResponseStatus(event, 201)
    return created
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && String(error.code).includes('SQLITE_CONSTRAINT_UNIQUE')) {
      throw createError({ statusCode: 409, message: 'Терруар с таким slug или кодом уже существует' })
    }
    throw error
  }
})
