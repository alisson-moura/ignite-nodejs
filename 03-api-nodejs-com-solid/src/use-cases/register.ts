import { hash } from 'bcryptjs';
import { EmailAlreadyInUseError } from './errors/email-already-in-use-error';
import { type User } from '@prisma/client';

interface Request {
  name: string
  email: string
  password: string
};

interface Response {
  user: User
}

export class RegisterUserUseCase {
  constructor (private readonly usersRepository: any) {}

  async execute ({ email, name, password }: Request): Promise<Response> {
    const emailAlreadyInUse = await this.usersRepository.findByEmail(email);
    if (emailAlreadyInUse != null) {
      throw new EmailAlreadyInUseError();
    }
    const passwordHash = await hash(password, 6);
    const user = await this.usersRepository.create({
      name, email, password_hash: passwordHash
    });
    return {
      user
    };
  }
}
