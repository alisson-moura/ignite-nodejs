import request from 'supertest';
import { app } from '@/app';
import { beforeAll, describe, expect, it, afterAll, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('Register User Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should be able to register', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'Jonh Doe', email: 'jonhDoe@mail.com', password: 'fake_password'
      });

    expect(response.statusCode).toEqual(201);
  });

  it('should not be able to register a user with a duplicate email address.', async () => {
    const duplicateUserRequest = {
      name: 'Jonh Doe',
      email: 'jonhDoe@mail.com',
      password: 'fake_password'
    };

    await request(app.server)
      .post('/users')
      .send(duplicateUserRequest);

    const response = await request(app.server)
      .post('/users')
      .send(duplicateUserRequest);

    expect(response.statusCode).toEqual(409);
  });
});
