import request from 'supertest';
import { type FastifyInstance } from 'fastify';

export async function createAndAuthenticateUser (
  app: FastifyInstance
): Promise<{ token: string }> {
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
  return { token };
}
