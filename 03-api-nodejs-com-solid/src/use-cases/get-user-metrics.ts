import { type CheckInsRepository } from '@/repositories/check-in-repository';

interface Request {
  userId: string
};

interface Response {
  countCheckIns: number
}

export class GetUserMetricsUseCase {
  constructor (
    private readonly checkInsRepository: CheckInsRepository
  ) { }

  async execute ({ userId }: Request): Promise<Response> {
    const countCheckIns = await this.checkInsRepository
      .countByUserId(userId);

    return {
      countCheckIns
    };
  }
}
