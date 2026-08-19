import { existsSync } from 'node:fs'
import { isAbsolute, resolve } from 'node:path'
import { loadEnvFile } from 'node:process'

const resolveEnvFile = (configuredPath?: string) => {
  const envFile = configuredPath || '.env'
  return isAbsolute(envFile) ? envFile : resolve(process.cwd(), envFile)
}

/**
 * Loads variables for standalone Node scripts, which do not read Nuxt's .env
 * automatically. Variables already supplied by the shell or systemd win over
 * values from the file.
 */
export const loadScriptEnvironment = (configuredPath = process.env.ENV_FILE) => {
  const envFile = resolveEnvFile(configuredPath)

  if (!existsSync(envFile)) {
    if (configuredPath) throw new Error(`Environment file not found: ${envFile}`)
    return undefined
  }

  const inheritedEnvironment = { ...process.env }
  loadEnvFile(envFile)
  Object.assign(process.env, inheritedEnvironment)

  return envFile
}
