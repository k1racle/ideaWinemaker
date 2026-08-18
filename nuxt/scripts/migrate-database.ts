import { resolve } from 'node:path'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { openDatabase } from '../server/database/connection.ts'

const context = openDatabase()

try {
  migrate(context.db, { migrationsFolder: resolve(process.cwd(), 'drizzle') })
  console.info(`SQLite migrations applied: ${context.path}`)
} finally {
  context.sqlite.close()
}
