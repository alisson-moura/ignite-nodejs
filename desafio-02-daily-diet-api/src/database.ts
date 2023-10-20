import { type Knex, knex } from 'knex'
import { env } from './env'

export const configKnex: Knex.Config = {
  client: env.DATABASE_CLIENT,
  migrations: {
    directory: 'database/migrations',
    extension: 'ts'
  },
  connection: env.NODE_ENV === 'production'
    ? env.DATABASE_URL
    : ({
        filename: env.DATABASE_URL
      }),
  useNullAsDefault: true
}

export const dbClient = knex(configKnex)
