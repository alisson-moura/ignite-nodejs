import request from 'supertest';
import { type FastifyInstance } from 'fastify';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function createAndAuthenticateUser (
  app: FastifyInstance, isAdmin = false
): Promise<{ token: string }> {
  await prisma.user.create({
    data: {
      name: 'Jonh Doe',
      email: 'jonhDoe@mail.com',
      password_hash: await hash('fake_password', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER'
    }
  });

  const authResponse = await request(app.server)
    .post('/sessions')
    .send({
      email: 'jonhDoe@mail.com',
      password: 'fake_password'
    });
  const { token } = authResponse.body;
  return { token };
}
