import { EmailAlreadyInUseError } from '@/use-cases/errors/email-already-in-use-error';
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-user-case';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function register (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const useCase = makeRegisterUseCase();
    await useCase.execute({ name, email, password });
  } catch (error) {
    if (error instanceof EmailAlreadyInUseError) {
      return await reply.status(409).send({ message: error.message });
    }
    throw error;
  }

  return await reply.status(201).send();
}
