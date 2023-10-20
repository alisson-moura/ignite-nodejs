import { type FastifyInstance } from 'fastify'
import { dbClient } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { jwtVerify } from './middlewares'

export async function mealsRoutes (app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', jwtVerify)

  app.post('/', async function handler (request, reply) {
    const createMealRequestBodySchema = z.object({
      name: z.string().min(3),
      description: z.string(),
      dietStatus: z.boolean()
    })
    const { description, dietStatus, name } = createMealRequestBodySchema.parse(request.body)
    const requestUser = request.user as { payload: string, iat: number }

    await dbClient('meals').insert({
      id: randomUUID(),
      user_id: requestUser.payload,
      name,
      description,
      diet_status: dietStatus
    })

    return await reply.status(201).send()
  })
  app.get('/', async function handler (request, reply) {
    const requestUser = request.user as { payload: string, iat: number }

    const meals = await dbClient('meals')
      .where({
        user_id: requestUser.payload
      })
      .select('*', 'diet_status as dietStatus')

    return { meals }
  })
}
