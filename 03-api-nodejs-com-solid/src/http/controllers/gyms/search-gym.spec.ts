import request from 'supertest';
import { app } from '@/app';
import { beforeAll, describe, expect, it, afterAll } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';

describe('Search Gyms Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms', async () => {
    const { token } = await createAndAuthenticateUser(app);
    await request(app.server)
      .post('/gyms')
      .send({
        title: 'fake gym 01',
        description: 'fake description',
        phone: 'fake phone',
        latitude: -20.8329029,
        longitude: -49.3957846
      })
      .set('Authorization', `Bearer ${token}`);

    await request(app.server)
      .post('/gyms')
      .send({
        title: 'fake gym 02',
        description: 'fake description',
        phone: 'fake phone',
        latitude: -20.8329029,
        longitude: -49.3957846
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: '01'
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'fake gym 01',
        description: 'fake description',
        phone: 'fake phone'
      })
    ]);
  });
});
