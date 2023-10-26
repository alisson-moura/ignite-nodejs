import { type CheckIn, type Prisma } from '@prisma/client';

export interface CheckInsRepository {
  create: (data: Prisma.CheckInUncheckedCreateInput) => Promise<CheckIn>
  findByUserOnDate: (data: { userId: string, date: Date }) => Promise<CheckIn | null>
  findManyByUserId: (id: string, page: number) => Promise<CheckIn[]>
  countByUserId: (id: string) => Promise<number>
  save: (checkIn: CheckIn) => Promise <CheckIn>
  findById: (id: string) => Promise <CheckIn | null>
}
