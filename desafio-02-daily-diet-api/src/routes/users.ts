import { type FastifyInstance } from 'fastify'
import { dbClient } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { jwtVerify } from './middlewares'

export async function userRoutes (app: FastifyInstance): Promise<void> {
  app.post('/', async function handler (request, reply) {
    const createUserRequestBodySchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6)
    })
    const { name, email, password } = createUserRequestBodySchema.parse(request.body)

    const emailInUse = await dbClient('users').where({ email }).first()
    if (emailInUse != null) {
      return await reply.status(400).send({ error: 'e-mail already in use' })
    }

    await dbClient('users').insert({
      id: randomUUID(),
      password,
      name,
      email
    })

    return await reply.status(201).send()
  })

  app.get('/', { preHandler: [jwtVerify] }, async (request, reply) => {
    const requestUser = request.user as { payload: string, iat: number }

    const user = await dbClient('users')
      .select('id', 'email', 'name')
      .where({ id: requestUser.payload })
      .first()

    return await reply.send({ user })
  })
}
