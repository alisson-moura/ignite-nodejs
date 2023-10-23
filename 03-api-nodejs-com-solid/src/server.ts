import { app } from './app'
import { env } from './env'

app.listen({
  host: '0.0.0.0',
  port: env.HTTP_PORT
})
  .then(() => {
    console.log(`API running on http://localhost:${env.HTTP_PORT}`)
  })
  .catch(err => { console.log(err) })
