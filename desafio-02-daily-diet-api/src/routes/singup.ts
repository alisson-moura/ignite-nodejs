import { type FastifyInstance } from 'fastify'
import { dbClient } from '../database'
import { z } from 'zod'

export async function signupRoute (app: FastifyInstance): Promise<void> {
  app.post('/', async function handler (request, reply) {
    const signupRequestBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6)
    })
    const { email, password } = signupRequestBodySchema.parse(request.body)

    const user = await dbClient('users').where({ email }).first()
    if (user == null || user.password !== password) {
      return await reply.status(400).send({ error: 'e-mail or password incorrect' })
    }
    const token = app.jwt.sign({ payload: user.id })

    return await reply.send({
      token
    })
  })
}
