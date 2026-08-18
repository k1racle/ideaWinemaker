import { loginSchema } from '../../validation/content'

export default defineEventHandler(async (event) => {
  assertAdminMutationRequest(event, 10_000)
  assertLoginAllowed(event)
  const body = await readValidatedBody(event, value => loginSchema.parse(value))
  const config = useRuntimeConfig(event)

  if (!config.adminLogin || !config.adminPasswordHash) {
    throw createError({ statusCode: 503, message: 'Учётная запись администратора не настроена' })
  }

  const passwordIsValid = await verifyPassword(config.adminPasswordHash, body.password).catch(() => false)
  if (body.login !== config.adminLogin || !passwordIsValid) {
    recordFailedLogin(event)
    throw createError({ statusCode: 401, message: 'Неверный логин или пароль' })
  }

  clearFailedLogins(event)
  await setUserSession(event, {
    user: { login: config.adminLogin, role: 'admin' },
    loggedInAt: new Date(),
  })

  return { ok: true }
})
