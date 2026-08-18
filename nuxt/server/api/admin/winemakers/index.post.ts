import { createWinemaker } from '../../../repositories/content'
import { createWinemakerSchema } from '../../../validation/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  assertAdminMutationRequest(event)
  const input = await readContentBody(event, createWinemakerSchema)
  try {
    const created = createWinemaker(input)
    setResponseStatus(event, 201)
    return created
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && String(error.code).includes('SQLITE_CONSTRAINT_UNIQUE')) {
      throw createError({ statusCode: 409, message: 'Винодел с таким slug уже существует' })
    }
    throw error
  }
})
