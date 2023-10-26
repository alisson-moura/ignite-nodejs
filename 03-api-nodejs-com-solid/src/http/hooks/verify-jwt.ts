import { type FastifyReply, type FastifyRequest } from 'fastify';

export async function verifyJwt (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch (error) {
    return await reply.status(401).send({ message: 'Unauthorized' });
  }
}
