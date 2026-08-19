import { mkdirSync } from 'node:fs'
import { dirname, isAbsolute, resolve } from 'node:path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema.ts'

export const resolveDatabasePath = (databasePath?: string) => {
  const configuredPath = databasePath || process.env.NUXT_DATABASE_PATH || process.env.DATABASE_PATH || '.data/ideawinemaker.sqlite'
  return isAbsolute(configuredPath) ? configuredPath : resolve(process.cwd(), configuredPath)
}

export const openDatabase = (databasePath?: string) => {
  const resolvedPath = resolveDatabasePath(databasePath)
  mkdirSync(dirname(resolvedPath), { recursive: true })

  const sqlite = new Database(resolvedPath)
  sqlite.pragma('foreign_keys = ON')
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('busy_timeout = 5000')

  return {
    path: resolvedPath,
    sqlite,
    db: drizzle(sqlite, { schema }),
  }
}

export type DatabaseContext = ReturnType<typeof openDatabase>
