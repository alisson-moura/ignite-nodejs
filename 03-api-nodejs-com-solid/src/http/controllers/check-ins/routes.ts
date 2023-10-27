import { type FastifyInstance } from 'fastify';
import { create } from './create';
import { history } from './history';
import { metrics } from './metrics';
import { validate } from './validate';
import { verifyUserRole } from '@/http/hooks/verify-user-role';

export async function checkInsRoutes (app: FastifyInstance): Promise<void> {
  app.post('/:gymId', create);
  app.get('/history', history);
  app.get('/metrics', metrics);
  app.patch(
    '/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate
  );
}
