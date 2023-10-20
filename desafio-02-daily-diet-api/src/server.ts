import { fastify } from './app'
import { env } from './env'

fastify.listen({ port: env.HTTP_PORT })
  .then(() => { console.log(`API is running on: http://localhost:${env.HTTP_PORT}`) })
  .catch((err) => {
    fastify.log.error(err)
    process.exit(1)
  })
