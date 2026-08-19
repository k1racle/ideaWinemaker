export const getApiErrorMessage = (error: unknown, fallback = 'Не удалось выполнить запрос') => {
  if (!error || typeof error !== 'object') return fallback
  if ('data' in error && error.data && typeof error.data === 'object') {
    const data = error.data as { statusMessage?: string, message?: string }
    return data.message || data.statusMessage || fallback
  }
  if ('message' in error && typeof error.message === 'string') return error.message
  return fallback
}

export const getApiValidationErrors = (error: unknown): string[] => {
  if (!error || typeof error !== 'object' || !('data' in error) || !error.data || typeof error.data !== 'object') return []
  const response = error.data as { data?: { validationErrors?: unknown } }
  const errors = response.data?.validationErrors
  return Array.isArray(errors) && errors.every(item => typeof item === 'string') ? errors : []
}
