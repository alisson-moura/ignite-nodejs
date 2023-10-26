import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { SearchGymsUseCase } from '../search-gyms';

export function makeSearchGymsUseCase (): SearchGymsUseCase {
  const gymsRepository = new PrismaGymsRepository();
  return new SearchGymsUseCase(gymsRepository);
}
