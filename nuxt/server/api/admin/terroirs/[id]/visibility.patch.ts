import { setTerroirVisibility } from '../../../../repositories/content'
import { visibilitySchema } from '../../../../validation/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  assertAdminMutationRequest(event, 10_000)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, message: 'Некорректный ID' })
  const input = await readValidatedBody(event, value => visibilitySchema.parse(value))
  const updated = setTerroirVisibility(id, input.isVisible)
  if (!updated) throw createError({ statusCode: 404, message: 'Терруар не найден' })
  return updated
})
