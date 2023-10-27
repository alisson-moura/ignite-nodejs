import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> {
  const bodySchema = z.object({
    title: z.string(),
    description: z.string(),
    phone: z.string(),
    latitude: z.number().refine((value) => (Math.abs(value) < 90)),
    longitude: z.number().refine((value) => (Math.abs(value) < 180))
  });
  const { description, latitude, longitude, phone, title } = bodySchema
    .parse(request.body);
  const useCase = makeCreateGymUseCase();
  await useCase.execute({ description, latitude, longitude, phone, title });
  return await reply.status(201).send();
}
