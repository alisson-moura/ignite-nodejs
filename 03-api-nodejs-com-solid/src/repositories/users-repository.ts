import { type User } from '@prisma/client';

export interface UsersRepository {
  create: (data: {
    name: string
    email: string
    password_hash: string
  }) => Promise<User>
  findByEmail: (email: string) => Promise<User | null>
  findById: (id: string) => Promise<User | null>
}
