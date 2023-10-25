import { hash } from 'bcryptjs';
import { EmailAlreadyInUseError } from './errors/email-already-in-use-error';

interface Request {
  name: string
  email: string
  password: string
};

export class RegisterUserUseCase {
  constructor (private readonly usersRepository: any) {}

  async execute ({ email, name, password }: Request): Promise<void> {
    const emailAlreadyInUse = await this.usersRepository.findByEmail(email);
    if (emailAlreadyInUse != null) {
      throw new EmailAlreadyInUseError();
    }
    const passwordHash = await hash(password, 6);
    await this.usersRepository.create({
      name, email, password_hash: passwordHash
    });
  }
}
