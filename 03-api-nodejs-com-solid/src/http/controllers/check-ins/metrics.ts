import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case';
import { type FastifyReply, type FastifyRequest } from 'fastify';

export async function metrics (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> {
  const useCase = makeGetUserMetricsUseCase();
  const { countCheckIns } = await useCase.execute({
    userId: request.user.sub
  });
  return await reply.status(200).send({ countCheckIns });
}
