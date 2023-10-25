import { type User } from '@prisma/client';
import { type UsersRepository } from '@/repositories/users-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface Request {
  userId: string
};

interface Response {
  user: User
}

export class GetUserProfileUseCase {
  constructor (private readonly usersRepository: UsersRepository) {}

  async execute ({ userId }: Request): Promise<Response> {
    const user = await this.usersRepository.findById(userId);
    if (user === null) {
      throw new ResourceNotFoundError();
    }

    return {
      user
    };
  }
}
