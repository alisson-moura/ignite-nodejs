import { prisma } from '@/lib/prisma';
import { type Prisma, type CheckIn } from '@prisma/client';
import { type CheckInsRepository } from '../check-in-repository';
import dayjs from 'dayjs';

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create (data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({
      data
    });
    return checkIn;
  }

  async findByUserOnDate (
    data: { userId: string, date: Date }
  ): Promise<CheckIn | null> {
    const startOfDay = dayjs(data.date).startOf('date');
    const endOfDay = dayjs(data.date).endOf('date');

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: data.userId,
        created_at: {
          gte: startOfDay.toDate(),
          lte: endOfDay.toDate()
        }
      }
    });

    return checkIn;
  }

  async findManyByUserId (id: string, page: number): Promise<CheckIn[]> {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: id
      },
      take: 20,
      skip: (page - 1) * 20
    });
    return checkIns;
  }

  async countByUserId (id: string): Promise<number> {
    const count = await prisma.checkIn
      .count({ where: { user_id: id } });
    return count;
  }

  async save (data: CheckIn): Promise<CheckIn> {
    const checkIn = await prisma.checkIn
      .update({ where: { id: data.id }, data });
    return checkIn;
  }

  async findById (id: string): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findUnique({ where: { id } });
    return checkIn;
  }
}
