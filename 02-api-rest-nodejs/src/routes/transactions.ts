import { type FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { dbClient } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes (app: FastifyInstance): Promise<void> {
  app.get('/summary',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const summary = await dbClient('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return {
        summary
      }
    })

  app.get('/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const transactions = await dbClient('transactions')
        .select()
        .where('session_id', sessionId)

      return {
        transactions
      }
    })

  app.get('/:id',
    { preHandler: [checkSessionIdExists] }
    , async (request, reply) => {
      const { sessionId } = request.cookies
      const getTransactionsParamsScheme = z.object({
        id: z.string().uuid()
      })
      const { id } = getTransactionsParamsScheme.parse(request.params)
      const transaction = await dbClient('transactions')
        .where({
          id,
          session_id: sessionId
        })
        .first()

      return {
        transaction
      }
    })

  app.post('/', async (request, reply) => {
    let sessionId = request.cookies.sessionId
    if (sessionId == null) {
      sessionId = randomUUID()
      void reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      })
    }

    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit'])
    })
    const { title, type, amount } = createTransactionBodySchema
      .parse(request.body)

    await dbClient('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId
    })

    return await reply.status(201).send()
  })
}
