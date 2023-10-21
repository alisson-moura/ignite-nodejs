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

    const [mealId] = await dbClient('meals').insert({
      id: randomUUID(),
      user_id: requestUser.payload,
      name,
      description,
      diet_status: dietStatus
    })
      .returning('id')

    return await reply.status(201).send({ meal: mealId })
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
  app.get('/:id', async function handler (request, reply) {
    const { id }: { id: string } = request.params as any
    const requestUser = request.user as { payload: string, iat: number }

    const meal = await dbClient('meals')
      .where({ id, user_id: requestUser.payload })
      .first()
      .select('*', 'diet_status as dietStatus')

    if (meal === undefined) {
      return await reply.status(400).send()
    }

    return { meal }
  })
  app.put('/:id', async function handler (request, reply) {
    const { id }: { id: string } = request.params as any

    const updateMealRequestBodySchema = z.object({
      name: z.string().min(3).optional(),
      description: z.string().optional(),
      dietStatus: z.boolean().optional()
    })

    const { description, dietStatus, name } = updateMealRequestBodySchema.parse(request.body)
    const requestUser = request.user as { payload: string, iat: number }

    const [mealId] = await dbClient('meals').update({
      name,
      description,
      diet_status: dietStatus
    }).where({
      id,
      user_id: requestUser.payload
    })
      .returning('id')

    return await reply.status(201).send({ meal: mealId })
  })
  app.delete('/:id', async function handler (request, reply) {
    const { id }: { id: string } = request.params as any
    const requestUser = request.user as { payload: string, iat: number }

    await dbClient('meals').delete().where({
      id,
      user_id: requestUser.payload
    })

    return await reply.status(204).send()
  })

  app.get('/summary', async function handler (request, reply) {
    const { payload: id } = request.user as { payload: string, iat: number }

    const meals = await dbClient('meals')
      .where('user_id', id)

    return {
      summary: {
        amountOfMeals: meals.length,
        mealsInDiet: meals.filter(meal => meal.diet_status).length,
        mealsOutDiet: meals.filter(meal => !meal.diet_status).length
      }
    }
  })
}
