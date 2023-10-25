import { compare } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { type User } from '@prisma/client';
import { type UsersRepository } from '@/repositories/users-repository';

interface Request {
  email: string
  password: string
};

interface Response {
  user: User
}

export class AuthenticateUseCase {
  constructor (private readonly usersRepository: UsersRepository) {}

  async execute ({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findByEmail(email);
    if (user === null) {
      throw new InvalidCredentialsError();
    }
    const doesPasswordMatch = await compare(password, user.password_hash);
    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }
    return {
      user
    };
  }
}
