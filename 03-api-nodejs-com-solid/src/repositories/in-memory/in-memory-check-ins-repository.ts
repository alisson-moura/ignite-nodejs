import { type CheckIn, type Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { type CheckInsRepository } from '../check-in-repository';
import dayjs from 'dayjs';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  readonly #items: CheckIn[] = [];

  async create (data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      created_at: new Date(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      validate_at: data.validate_at != null ? new Date(data.validate_at) : null
    };

    this.#items.push(checkIn);
    return checkIn;
  }

  async findByUserOnDate (data: {
    userId: string
    date: Date
  }): Promise<CheckIn | null> {
    const checkIn = this.#items.find(item => {
      const checkInDate = dayjs(item.created_at);
      return item.user_id === data.userId && checkInDate.isSame(dayjs(), 'day');
    });
    if (checkIn != null) {
      return checkIn;
    }
    return null;
  }

  async findManyByUserId (id: string, page: number): Promise<CheckIn[]> {
    const checkIns = this.#items
      .filter(item => item.user_id === id)
      .slice((page - 1) * 20, page * 20);

    return checkIns;
  }

  async countByUserId (id: string): Promise<number> {
    const checkIns = this.#items
      .filter(item => item.user_id === id);

    return checkIns.length;
  }

  async save (checkIn: CheckIn): Promise<CheckIn> {
    const index = this.#items.findIndex(item => item.id === checkIn.id);
    if (index >= 0) {
      this.#items[index] = checkIn;
    }
    return checkIn;
  }

  async findById (id: string): Promise<CheckIn | null> {
    const checkIn = this.#items.find(item => item.id === id);
    return checkIn ?? null;
  }
}
