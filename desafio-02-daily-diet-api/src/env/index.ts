import { config } from 'dotenv'
import { z } from 'zod'

config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']).default('production'),
  HTTP_PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(3),
  DATABASE_CLIENT: z.enum(['sqlite3', 'pg']),
  JWT_SECRET: z.string().min(6)
})

const _env = envSchema.safeParse(process.env)
if (!_env.success) {
  console.error('⚠ Invalid enviroment variables: ', _env.error.format())
  process.exit(1)
}

export const env = _env.data
