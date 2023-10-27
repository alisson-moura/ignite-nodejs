import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function history (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> {
  const querySchema = z.object({
    page: z.coerce.number().min(1).default(1)
  });
  const { page } = querySchema
    .parse(request.query);
  const useCase = makeFetchUserCheckInsHistoryUseCase();
  const { checkIns } = await useCase.execute({
    userId: request.user.sub,
    page
  });
  return await reply.status(200).send({ checkIns });
}
