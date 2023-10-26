import { type FastifyInstance } from 'fastify';
import { register } from './controllers/register';
import { authenticate } from './controllers/authenticate';
import { profile } from './controllers/profile';
import { verifyJwt } from './hooks/verify-jwt';

export async function routes (app: FastifyInstance): Promise<void> {
  app.post('/users', register);
  app.post('/sessions', authenticate);

  // Authenticate routes
  app.addHook('onRequest', verifyJwt);
  app.get('/me', profile);
}
