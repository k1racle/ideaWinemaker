export default defineEventHandler(async (event) => {
  assertAdminMutationRequest(event, 10_000)
  await clearUserSession(event)
  return { ok: true }
})
