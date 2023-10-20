import { type FastifyReply, type FastifyRequest } from 'fastify'

export async function jwtVerify (request: FastifyRequest, reply: FastifyReply):
Promise<void> {
  try {
    await request.jwtVerify()
  } catch (err) {
    await reply.send(err)
  }
}
