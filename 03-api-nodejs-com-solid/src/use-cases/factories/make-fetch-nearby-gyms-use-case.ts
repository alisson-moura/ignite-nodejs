import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms';

export function makeFetchNearbyGymsUseCase (): FetchNearbyGymsUseCase {
  const gymsRepository = new PrismaGymsRepository();
  return new FetchNearbyGymsUseCase(gymsRepository);
}
