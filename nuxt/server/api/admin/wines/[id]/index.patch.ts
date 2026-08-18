import { updateWine } from '../../../../repositories/content'
import { updateWineSchema } from '../../../../validation/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  assertAdminMutationRequest(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, message: 'Некорректный ID' })
  const input = await readContentBody(event, updateWineSchema)

  try {
    const updated = updateWine(id, input)
    if (!updated) throw createError({ statusCode: 404, message: 'Вино не найдено' })
    return updated
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
