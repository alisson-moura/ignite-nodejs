import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GetUserProfileUseCase } from '../get-user-profile';

export function makeGetUserProfileUseCase (): GetUserProfileUseCase {
  const usersRepository = new PrismaUsersRepository();
  return new GetUserProfileUseCase(usersRepository);
}
