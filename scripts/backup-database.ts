import { mkdirSync } from 'node:fs'
import { isAbsolute, resolve } from 'node:path'
import { openDatabase } from '../server/database/connection.ts'
import { loadScriptEnvironment } from './load-script-environment.ts'

loadScriptEnvironment()
const context = openDatabase()
const configuredDirectory = process.env.DATABASE_BACKUP_DIR || '.data/backups'
const backupDirectory = isAbsolute(configuredDirectory) ? configuredDirectory : resolve(process.cwd(), configuredDirectory)
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const destination = resolve(backupDirectory, `ideawinemaker-${timestamp}.sqlite`)

try {
  mkdirSync(backupDirectory, { recursive: true })
  await context.sqlite.backup(destination)
  console.info(`SQLite backup created: ${destination}`)
} finally {
  context.sqlite.close()
}
