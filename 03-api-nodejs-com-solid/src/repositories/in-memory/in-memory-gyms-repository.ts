import { Prisma, type Gym } from '@prisma/client';
import { type GymsRepository } from '../gyms-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryGymsRepository implements GymsRepository {
  readonly #items: Gym[] = [];

  async findById (id: string): Promise<Gym | null> {
    const gym = this.#items.find(item => item.id === id);
    return gym ?? null;
  }

  async create (data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: randomUUID(),
      phone: 'fake_phone',
      ...data,
      latitude: new Prisma.Decimal(data.latitude as number),
      longitude: new Prisma.Decimal(data.longitude as number)
    };

    this.#items.push(gym);
    return gym;
  }
}
