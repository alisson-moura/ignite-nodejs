import { expect, it, describe, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let sut: GetUserProfileUseCase;
let userId: string;
describe('Get User Profile Use Case', () => {
  beforeEach(async () => {
    const usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);

    await usersRepository.create({
      email: 'fake_email@mail.com',
      name: 'fake name',
      password_hash: await hash('fake_password', 6)
    }).then((user) => {
      userId = user.id;
    });
  });

  it('should  be able to get user profile', async () => {
    const { user } = await sut.execute({ userId });

    expect(user.id).toEqual(userId);
    expect(user.name).toEqual('fake name');
    expect(user.created_at).toEqual(expect.any(Date));
  });

  it('should not be able to get user profile with wrong id', async () => {
    await expect(sut.execute({
      userId: 'wrong_id'
    })).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
