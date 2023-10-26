import { type Prisma, type Gym } from '@prisma/client';

export interface GymsRepository {
  create: (data: Prisma.GymCreateInput) => Promise<Gym>
  findById: (id: string) => Promise<Gym | null>
}