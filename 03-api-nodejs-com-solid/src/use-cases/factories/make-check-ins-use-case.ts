import { CheckInUseCase } from '../check-ins';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeChekInUseCase (): CheckInUseCase {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();
  return new CheckInUseCase(checkInsRepository, gymsRepository);
}
