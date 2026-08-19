import type { DatabaseContext } from '../database/connection.ts'
import { openDatabase } from '../database/connection.ts'

declare global {
  var __ideaWinemakerDatabase: DatabaseContext | undefined
}

export const useContentDatabase = () => {
  if (!globalThis.__ideaWinemakerDatabase) {
    const config = useRuntimeConfig()
    globalThis.__ideaWinemakerDatabase = openDatabase(config.databasePath)
  }

  return globalThis.__ideaWinemakerDatabase
}
