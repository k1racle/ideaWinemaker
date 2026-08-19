import type { H3Event } from 'h3'

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 8

interface LoginAttempts {
  count: number
  resetAt: number
}

const attempts = new Map<string, LoginAttempts>()

const keyFor = (event: H3Event) => getRequestIP(event, { xForwardedFor: true }) || 'unknown'

export const assertLoginAllowed = (event: H3Event) => {
  const key = keyFor(event)
  const current = attempts.get(key)
  if (!current) return

  if (current.resetAt <= Date.now()) {
    attempts.delete(key)
    return
  }

  if (current.count >= MAX_ATTEMPTS) {
    throw createError({ statusCode: 429, message: 'Слишком много попыток. Попробуйте позже.' })
  }
}

export const recordFailedLogin = (event: H3Event) => {
  const key = keyFor(event)
  const current = attempts.get(key)
  if (!current || current.resetAt <= Date.now()) {
    attempts.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS })
    return
  }
  current.count += 1
}

export const clearFailedLogins = (event: H3Event) => {
  attempts.delete(keyFor(event))
}
