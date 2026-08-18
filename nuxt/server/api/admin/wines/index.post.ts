import { createWine } from '../../../repositories/content'
import { createWineSchema } from '../../../validation/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  assertAdminMutationRequest(event)
  const input = await readContentBody(event, createWineSchema)
  try {
    const created = createWine(input)
    setResponseStatus(event, 201)
    return created
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && String(error.code).includes('SQLITE_CONSTRAINT_UNIQUE')) {
      throw createError({ statusCode: 409, message: 'Вино с таким slug уже существует' })
    }
    if (error && typeof error === 'object' && 'code' in error && String(error.code).includes('SQLITE_CONSTRAINT_FOREIGNKEY')) {
      throw createError({ statusCode: 422, message: 'Выбранный винодел или терруар не найден. Обновите страницу и выберите значения снова.' })
    }
    throw error
  }
})
