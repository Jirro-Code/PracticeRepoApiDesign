//drizzle-kit is a CLI tool for managing database migrations and automatically
//generate pre-typed query for your database
import { defineConfig } from 'drizzle-kit'
import {env} from "./env.ts"

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
})
