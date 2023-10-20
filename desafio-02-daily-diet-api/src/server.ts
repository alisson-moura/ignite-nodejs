import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' }
})

fastify.listen({ port: 3000 })
  .then(() => { console.log('API is running on: http://localhost:3000') })
  .catch((err) => {
    fastify.log.error(err)
    process.exit(1)
  })
