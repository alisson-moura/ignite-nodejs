import { type GymsRepository } from '@/repositories/gyms-repository';
import { type Gym } from '@prisma/client';

interface Request {
  title: string
  description: string
  phone: string
  latitude: number
  longitude: number
}

interface Response {
  gym: Gym
}

export class CreateGymUseCase {
  constructor (private readonly gymsRepository: GymsRepository) {}

  async execute (data: Request): Promise<Response> {
    const gym = await this.gymsRepository.create(data);
    return { gym };
  }
}
