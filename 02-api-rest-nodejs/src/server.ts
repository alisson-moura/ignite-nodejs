import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

void app.register(cookie)
void app.register(transactionsRoutes, { prefix: 'transactions' })

app.listen({ port: env.PORT })
  .then(() => { console.log('HTTP Server Running.') })
  .catch(err => { console.log(err.message) })
