import request from 'supertest';
import { app } from '@/app';
import { beforeAll, describe, expect, it, afterAll } from 'vitest';

describe('Profile Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to get user profile', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Jonh Doe', email: 'jonhDoe@mail.com', password: 'fake_password'
      });
    const authResponse = await request(app.server)
      .post('/sessions')
      .send({
        email: 'jonhDoe@mail.com',
        password: 'fake_password'
      });
    const { token } = authResponse.body;

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.user).toEqual(expect.objectContaining({
      email: 'jonhDoe@mail.com',
      name: 'Jonh Doe'
    }));
  });
});
