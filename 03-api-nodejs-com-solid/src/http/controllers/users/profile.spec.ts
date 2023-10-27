import request from 'supertest';
import { app } from '@/app';
import { beforeAll, describe, expect, it, afterAll } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';

describe('Profile Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to get user profile', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.user).toEqual(expect.objectContaining({
      email: 'jonhDoe@mail.com',
      name: 'Jonh Doe'
    }));
  });
});
