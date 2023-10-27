import { type FastifyInstance } from 'fastify';
import { register } from './controllers/register';
import { authenticate } from './controllers/authenticate';
import { profile } from './controllers/profile';
import { verifyJwt } from './hooks/verify-jwt';

export async function privateRoutes (app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', verifyJwt);
  app.get('/me', profile);
}

export async function publicRoutes (app: FastifyInstance): Promise<void> {
  app.post('/users', register);
  app.post('/sessions', authenticate);
}
