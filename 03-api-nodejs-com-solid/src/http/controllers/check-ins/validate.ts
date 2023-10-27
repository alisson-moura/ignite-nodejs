import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function validate (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> {
  const paramsSchema = z.object({
    checkInId: z.string().uuid()
  });

  const { checkInId } = paramsSchema.parse(request.params);

  const useCase = makeValidateCheckInUseCase();
  await useCase.execute({
    checkInId
  });
  return await reply.status(204).send();
}
