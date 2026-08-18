import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/database/schema.ts',
  out: process.env.DRIZZLE_OUT || './drizzle',
  dbCredentials: {
    url: process.env.NUXT_DATABASE_PATH || process.env.DATABASE_PATH || './.data/ideawinemaker.sqlite',
  },
})
