import { type Prisma, type Gym } from '@prisma/client';
import { type FindManyNearByParams, type GymsRepository } from '../gyms-repository';
import { prisma } from '@/lib/prisma';

export class PrismaGymsRepository implements GymsRepository {
  async findById (id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({ where: { id } });
    return gym;
  }

  async create (data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({ data });
    return gym;
  }

  async findMany (query: string, page: number): Promise<Gym[]> {
    const gyms = await prisma.gym.findMany({
      take: 20,
      skip: (page - 1) * 20,
      where: {
        title: {
          contains: query
        }
      }
    });
    return gyms;
  }

  async findManyNearBy ({ latitude, longitude }: FindManyNearByParams): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;
    return gyms;
  }
}
