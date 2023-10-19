import { type FastifyReply, type FastifyRequest } from 'fastify'

export async function checkSessionIdExists (req: FastifyRequest,
  reply: FastifyReply): Promise<void> {
  const { sessionId } = req.cookies

  if (sessionId == null) {
    return await reply.status(401).send({
      error: 'Unauthorized'
    })
  }
}
