import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { z } from 'zod';

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
    const { user } = await useCase.execute({ email, password });
    const token = await reply.jwtSign({ role: user.role }, {
      sign: {
        sub: user.id
      }
    });
    const refreshToken = await reply.jwtSign({ role: user.role }, {
      sign: {
        sub: user.id,
        expiresIn: '7d'
      }
    });
    return await reply.status(200)
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        sameSite: true,
        secure: true,
        httpOnly: true
      })
      .send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return await reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
