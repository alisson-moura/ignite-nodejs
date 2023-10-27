import { type FastifyInstance } from 'fastify';
import { create } from './create-gym';
import { search } from './search-gym';
import { nearby } from './nearby-gyms';
import { verifyUserRole } from '@/http/hooks/verify-user-role';

export async function gymsRoutes (app: FastifyInstance): Promise<void> {
  app.post('/', { onRequest: [verifyUserRole('ADMIN')] }, create);
  app.get('/search', search);
  app.get('/nearby', nearby);
}
