import request from 'supertest';
import { app } from '@/app';
import { beforeAll, describe, expect, it, afterAll } from 'vitest';

describe('Authenticate Controller (e2e)', () => {
  const correctCredentials = {
    email: 'jonhDoe@mail.com',
    password: 'fake_password'
  };

  beforeAll(async () => {
    await app.ready();

    // creata an fake user
    await request(app.server)
      .post('/users')
      .send({
        name: 'Jonh Doe',
        ...correctCredentials
      });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to authenticate', async () => {
    const response = await request(app.server)
      .post('/sessions')
      .send(correctCredentials);

    expect(response.statusCode).toEqual(200);
    expect(response.body.token).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with incorrect credentials.', async () => {
    const response = await request(app.server)
      .post('/sessions')
      .send({
        email: 'wrong@mail.com',
        password: 'fake_password'
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual('Invalid credentials.');
  });
});
