import { type Prisma, type User } from '@prisma/client';
import { type UsersRepository } from '../users-repository';
import { randomUUID } from 'crypto';

export class InMemoryUsersRepository implements UsersRepository {
  readonly #items: User[] = [];

  async findByEmail (email: string): Promise<User | null> {
    const user = this.#items.find(item => item.email === email);

    return user ?? null;
  }

  async create (data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      created_at: new Date(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash
    };

    this.#items.push(user);
    return user;
  }
}
