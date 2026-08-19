import type { H3Event } from 'h3'

export const assertAdminMutationRequest = (event: H3Event, maxBytes = 2_000_000) => {
  const contentLength = Number(getHeader(event, 'content-length') || 0)
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw createError({ statusCode: 413, message: 'Слишком большой запрос' })
  }

  const origin = getHeader(event, 'origin')
  if (!origin) return

  let originUrl: URL
  try {
    originUrl = new URL(origin)
  } catch {
    throw createError({ statusCode: 403, message: 'Недопустимый источник запроса' })
  }

  const requestOrigin = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true }).origin
  if (originUrl.origin !== requestOrigin) {
    throw createError({ statusCode: 403, message: 'Недопустимый источник запроса' })
  }
}
