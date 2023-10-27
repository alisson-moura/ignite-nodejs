import request from 'supertest';
import { app } from '@/app';
import { beforeAll, describe, expect, it, afterAll } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';

describe('Create Gym Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to create an gym', async () => {
    const { token } = await createAndAuthenticateUser(app);
    const response = await request(app.server)
      .post('/gyms')
      .send({
        title: 'fake title',
        description: 'fake description',
        phone: 'fake phone',
        latitude: -20.8329029,
        longitude: -49.3957846
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(201);
  });
});
