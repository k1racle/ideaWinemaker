import { Hash } from '@adonisjs/hash'
import { Scrypt } from '@adonisjs/hash/drivers/scrypt'

const password = process.argv[2]
if (!password) {
  console.error('Usage: npm run auth:hash -- "your password"')
  process.exitCode = 1
} else {
  const hash = new Hash(new Scrypt())
  console.info(`NUXT_ADMIN_PASSWORD_HASH='${await hash.make(password)}'`)
}
