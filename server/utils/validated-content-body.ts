import type { H3Event } from 'h3'
import type { ZodType } from 'zod'

export const readContentBody = async <Output>(event: H3Event, schema: ZodType<Output>) => {
  const body = await readBody(event)
  const result = schema.safeParse(body)

  if (result.success) return result.data

  const validationErrors = [...new Set(result.error.issues.map(issue => issue.message))]
  throw createError({
    statusCode: 422,
    statusMessage: 'Validation Failed',
    message: validationErrors.join(' · '),
    data: { validationErrors },
  })
}
