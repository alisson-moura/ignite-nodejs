import fastify from 'fastify'
import { dbClient } from './database'
import { env } from './env'

const app = fastify()

app.get('/', async () => {
  const tables = await dbClient('sqlite_schema').select('*')
  return tables
})

app.listen({ port: env.PORT })
  .then(() => { console.log('HTTP Server Running.') })
  .catch(err => { console.log(err.message) })
