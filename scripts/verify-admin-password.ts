import { readFileSync } from 'node:fs'
import { Hash } from '@adonisjs/hash'
import { Scrypt } from '@adonisjs/hash/drivers/scrypt'

const password = process.argv[2]

if (!password) {
  console.error('Usage: npm run auth:verify -- "your password"')
  process.exitCode = 1
} else {
  const envFile = readFileSync('.env', 'utf8')
  const hashLine = envFile.match(/^\s*NUXT_ADMIN_PASSWORD_HASH\s*=\s*(.+?)\s*$/m)?.[1]

  if (!hashLine) {
    console.error('NUXT_ADMIN_PASSWORD_HASH is not configured in .env')
    process.exitCode = 1
  } else {
    const quote = hashLine[0]
    const storedHash = (quote === "'" || quote === '"') && hashLine.at(-1) === quote
      ? hashLine.slice(1, -1)
      : hashLine
    const matches = await new Hash(new Scrypt()).verify(storedHash, password).catch(() => false)

    console.info(matches ? 'Password matches .env hash' : 'Password does not match .env hash')
    if (!matches) process.exitCode = 1
  }
}
