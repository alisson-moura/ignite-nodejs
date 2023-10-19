import { knex, type Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: env.DATABASE_TYPE,
  connection:
    env.DATABASE_TYPE === 'sqlite3'
      ? {
          filename: env.DATABASE_URL
        }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations'
  }
}
export const dbClient = knex(config)
