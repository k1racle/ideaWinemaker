import { getAdminContentOverview } from '../../repositories/content'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  return getAdminContentOverview()
})
