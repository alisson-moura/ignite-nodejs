import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { CreateGymUseCase } from '../create-gym';

export function makeCreateGymUseCase (): CreateGymUseCase {
  const gymsRepository = new PrismaGymsRepository();
  return new CreateGymUseCase(gymsRepository);
}
