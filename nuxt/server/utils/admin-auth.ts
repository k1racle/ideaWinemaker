import type { H3Event } from 'h3'

export const requireAdminSession = async (event: H3Event) => {
  const session = await requireUserSession(event)
  if (session.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Недостаточно прав' })
  }
  return session
}
