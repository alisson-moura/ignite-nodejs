import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function search (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> {
  const querySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1)
  });
  const { query, page } = querySchema
    .parse(request.query);
  const useCase = makeSearchGymsUseCase();
  const { gyms } = await useCase.execute({ query, page });
  return await reply.status(200).send({ gyms });
}
