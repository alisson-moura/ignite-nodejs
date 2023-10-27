import { type FastifyInstance } from 'fastify';
import { create } from './create-gym';
import { search } from './search-gym';
import { nearby } from './nearby-gyms';

export async function gymsRoutes (app: FastifyInstance): Promise<void> {
  app.post('/', create);
  app.get('/search', search);
  app.get('/nearby', nearby);
}
