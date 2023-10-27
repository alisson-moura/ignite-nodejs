import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function nearby (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> {
  const querySchema = z.object({
    latitude: z.number().refine((value) => (Math.abs(value) < 90)),
    longitude: z.number().refine((value) => (Math.abs(value) < 180))
  });
  const { latitude, longitude } = querySchema
    .parse(request.query);
  const useCase = makeFetchNearbyGymsUseCase();
  const { gyms } = await useCase.execute({
    userLatitude: latitude,
    userLongitude: longitude
  });
  return await reply.status(200).send({ gyms });
}
