import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterUserUseCase } from '../register';

export function makeRegisterUseCase (): RegisterUserUseCase {
  const usersRepository = new PrismaUsersRepository();
  return new RegisterUserUseCase(usersRepository);
}
