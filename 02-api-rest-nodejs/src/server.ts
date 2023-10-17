import fastify from 'fastify'

const app = fastify()

app.get('/', () => 'hello world')

app.listen({ port: 3000 })
  .then(() => { console.log('HTTP Server Running.') })
  .catch(err => { console.log(err.message) })
