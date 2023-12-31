import { type Prisma, type Gym } from '@prisma/client';

export interface GymsRepository {
  create: (data: Prisma.GymCreateInput) => Promise<Gym>
  findById: (id: string) => Promise<Gym | null>
  findMany: (query: string, page: number) => Promise<Gym[]>
  findManyNearBy: (params: FindManyNearByParams) => Promise<Gym[]>
}

export interface FindManyNearByParams {
  latitude: number
  longitude: number
}
