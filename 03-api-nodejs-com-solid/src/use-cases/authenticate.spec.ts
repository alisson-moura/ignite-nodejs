import { expect, it, describe, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let sut: AuthenticateUseCase;
const fakeCrendentials = {
  email: 'fake_email@mail.com',
  password: 'fake_password'
};
describe('Authenticate Use Case', () => {
  beforeEach(async () => {
    const usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      email: 'fake_email@mail.com',
      name: 'fake name',
      password_hash: await hash(fakeCrendentials.password, 6)
    });
  });

  it('should  be able to authentica', async () => {
    const { user } = await sut.execute(fakeCrendentials);

    expect(user.id).toEqual(expect.any(String));
    expect(user.created_at).toEqual(expect.any(Date));
  });

  it('should not be able to authentica with wrong email', async () => {
    await expect(sut.execute({
      ...fakeCrendentials,
      email: 'wrong_mail@mail.com'
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authentica with wrong password', async () => {
    await expect(sut.execute({
      ...fakeCrendentials,
      password: 'wrong_password'
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
