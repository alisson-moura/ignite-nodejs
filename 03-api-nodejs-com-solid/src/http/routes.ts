import { type FastifyInstance } from 'fastify';
import { register } from './controllers/users/register';
import { authenticate } from './controllers/users/authenticate';
import { profile } from './controllers/users/profile';
import { verifyJwt } from './hooks/verify-jwt';
import { checkInsRoutes } from './controllers/check-ins/routes';
import { gymsRoutes } from './controllers/gyms/routes';

export async function privateRoutes (app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', verifyJwt);
  void app.register(checkInsRoutes, { prefix: '/check-ins' });
  void app.register(gymsRoutes, { prefix: '/gyms' });
  app.get('/me', profile);
}

export async function publicRoutes (app: FastifyInstance): Promise<void> {
  app.post('/users', register);
  app.post('/sessions', authenticate);
}
