import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateUseCase } from '../authenticate';

export function makeAuthenticateUseCase (): AuthenticateUseCase {
  const usersRepository = new PrismaUsersRepository();
  return new AuthenticateUseCase(usersRepository);
}
