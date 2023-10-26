import { type GymsRepository } from '@/repositories/gyms-repository';
import { type Gym } from '@prisma/client';

interface Request {
  query: string
  page: number
};

interface Response {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor (
    private readonly gymsRepository: GymsRepository
  ) { }

  async execute ({ query, page }: Request): Promise<Response> {
    const gyms = await this.gymsRepository.findMany(query, page);

    return {
      gyms
    };
  }
}
