import { expect, it, describe, beforeEach } from 'vitest';
import { RegisterUserUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { EmailAlreadyInUseError } from './errors/email-already-in-use-error';

let sut: RegisterUserUseCase;
describe('Register User Use Case', () => {
  beforeEach(() => {
    const usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUserUseCase(usersRepository);
  });

  it('should  be able to register', async () => {
    const fakeRequest = {
      email: 'fake_mail@mail.com',
      name: 'fake name',
      password: 'fake_password'
    };
    const { user } = await sut.execute(fakeRequest);

    expect(user.name).toEqual(fakeRequest.name);
    expect(user.email).toEqual(fakeRequest.email);
    expect(user.id).toEqual(expect.any(String));
    expect(user.created_at).toEqual(expect.any(Date));
  });

  it('should hash user password upon registration', async () => {
    const plainPassword = 'fake_password';

    const { user } = await sut.execute({
      email: 'fake_mail@mail.com',
      name: 'fake name',
      password: plainPassword
    });
    const hashedPassword = user.password_hash;

    const isPasswordCorrectlyHashed = await compare(
      plainPassword,
      hashedPassword
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const fakeRequest = {
      email: 'fake_mail@mail.com',
      name: 'fake name',
      password: 'fake_password'
    };
    await sut.execute(fakeRequest);

    await expect(sut.execute(fakeRequest))
      .rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });
});
