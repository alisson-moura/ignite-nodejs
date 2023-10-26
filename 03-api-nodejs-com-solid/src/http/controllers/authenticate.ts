import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';

export async function authenticate (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string()
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const useCase = makeAuthenticateUseCase();
    await useCase.execute({ email, password });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return await reply.status(400).send({ message: error.message });
    }
    throw error;
  }

  return await reply.status(200).send();
}
