import { setWinemakerVisibility } from '../../../../repositories/content'
import { visibilitySchema } from '../../../../validation/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  assertAdminMutationRequest(event, 10_000)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, message: 'Некорректный ID' })
  const input = await readValidatedBody(event, value => visibilitySchema.parse(value))
  const updated = setWinemakerVisibility(id, input.isVisible)
  if (!updated) throw createError({ statusCode: 404, message: 'Винодел не найден' })
  return updated
})
