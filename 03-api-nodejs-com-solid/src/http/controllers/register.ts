import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { EmailAlreadyInUseError } from '@/use-cases/errors/email-already-in-use-error';
import { RegisterUserUseCase } from '@/use-cases/register';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function register (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const useCase = new RegisterUserUseCase(usersRepository);
    await useCase.execute({ name, email, password });
  } catch (error) {
    if (error instanceof EmailAlreadyInUseError) {
      return await reply.status(409).send({ message: error.message });
    }
    throw error;
  }

  return await reply.status(201).send();
}
