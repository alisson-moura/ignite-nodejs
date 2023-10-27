import request from 'supertest';
import { app } from '@/app';
import { beforeAll, describe, expect, it, afterAll } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';

describe('Fetch Nearby Gyms Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to fetch nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true);
    await request(app.server)
      .post('/gyms')
      .send({
        title: 'Near Gym',
        description: 'fake gym',
        phone: 'fake number',
        latitude: -27.2092052,
        longitude: -49.6401091
      })
      .set('Authorization', `Bearer ${token}`);

    await request(app.server)
      .post('/gyms')
      .send({
        title: 'Far Gym',
        description: 'fake gym',
        phone: 'fake number',
        latitude: -27.0610928,
        longitude: -49.5229501
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -27.2092052,
        longitude: -49.6401091
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
        description: 'fake gym',
        phone: 'fake number'
      })
    ]);
  });
});
