import { type CheckIn } from '@prisma/client';
import { type CheckInsRepository } from '@/repositories/check-in-repository';

interface Request {
  userId: string
  page: number
};

interface Response {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor (
    private readonly checkInsRepository: CheckInsRepository
  ) { }

  async execute ({ userId, page }: Request): Promise<Response> {
    const checkIns = await this.checkInsRepository
      .findManyByUserId(userId, page);

    return {
      checkIns
    };
  }
}
