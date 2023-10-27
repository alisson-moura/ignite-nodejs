import { makeChekInUseCase } from '@/use-cases/factories/make-check-ins-use-case';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> {
  const paramsSchema = z.object({
    gymId: z.string().uuid()
  });
  const bodySchema = z.object({

    latitude: z.number().refine((value) => (Math.abs(value) < 90)),
    longitude: z.number().refine((value) => (Math.abs(value) < 180))
  });
  const { latitude, longitude } = bodySchema.parse(request.body);
  const { gymId } = paramsSchema.parse(request.params);

  const useCase = makeChekInUseCase();
  await useCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude
  });
  return await reply.status(201).send();
}
