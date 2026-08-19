import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { loadScriptEnvironment } from '../scripts/load-script-environment'

const loadedKey = 'IDEA_WINEMAKER_TEST_LOADED'
const inheritedKey = 'IDEA_WINEMAKER_TEST_INHERITED'

let testDirectory: string
let previousLoadedValue: string | undefined
let previousInheritedValue: string | undefined

beforeEach(() => {
  testDirectory = mkdtempSync(join(tmpdir(), 'ideawinemaker-env-test-'))
  previousLoadedValue = process.env[loadedKey]
  previousInheritedValue = process.env[inheritedKey]
  Reflect.deleteProperty(process.env, loadedKey)
  process.env[inheritedKey] = 'from-process'
})

afterEach(() => {
  if (previousLoadedValue === undefined) Reflect.deleteProperty(process.env, loadedKey)
  else process.env[loadedKey] = previousLoadedValue

  if (previousInheritedValue === undefined) Reflect.deleteProperty(process.env, inheritedKey)
  else process.env[inheritedKey] = previousInheritedValue

  rmSync(testDirectory, { recursive: true, force: true })
})

describe('standalone script environment', () => {
  it('loads a configured env file without replacing inherited variables', () => {
    const envFile = join(testDirectory, 'runtime.env')
    writeFileSync(envFile, `${loadedKey}=from-file\n${inheritedKey}=from-file\n`)

    expect(loadScriptEnvironment(envFile)).toBe(envFile)
    expect(process.env[loadedKey]).toBe('from-file')
    expect(process.env[inheritedKey]).toBe('from-process')
  })

  it('fails clearly when an explicitly configured env file does not exist', () => {
    const missingFile = join(testDirectory, 'missing.env')
    expect(() => loadScriptEnvironment(missingFile)).toThrow(`Environment file not found: ${missingFile}`)
  })
})
