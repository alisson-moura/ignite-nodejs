import { Prisma, type Gym } from '@prisma/client';
import { type FindManyNearByParams, type GymsRepository } from '../gyms-repository';
import { randomUUID } from 'node:crypto';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

export class InMemoryGymsRepository implements GymsRepository {
  readonly #items: Gym[] = [];

  async findById (id: string): Promise<Gym | null> {
    const gym = this.#items.find(item => item.id === id);
    return gym ?? null;
  }

  async create (data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      ...data,
      id: data.id ?? randomUUID(),
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude as number),
      longitude: new Prisma.Decimal(data.longitude as number)
    };

    this.#items.push(gym);
    return gym;
  }

  async findMany (query: string, page: number): Promise<Gym[]> {
    const gyms = this.#items
      .filter(item => item.title.includes(query))
      .slice((page - 1) * 20, page * 20);
    return gyms;
  }

  async findManyNearBy ({ latitude, longitude }: FindManyNearByParams): Promise<Gym[]> {
    const gyms = this.#items
      .filter(item => {
        const distance = getDistanceBetweenCoordinates(
          { latitude, longitude },
          { latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber() }
        );
        return distance < 10;
      });
    return gyms;
  }
}
