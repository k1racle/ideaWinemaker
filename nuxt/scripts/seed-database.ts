import { openDatabase } from '../server/database/connection.ts'
import { seedExistingContent } from '../server/database/seed.ts'
import { loadScriptEnvironment } from './load-script-environment.ts'

loadScriptEnvironment()
const context = openDatabase()

try {
  const result = seedExistingContent(context)
  console.info(`SQLite seed complete: ${result.winemakersCount} winemakers, ${result.terroirsCount} terroirs, ${result.winesCount} wines, ${result.storesCount} stores`)
} finally {
  context.sqlite.close()
}
