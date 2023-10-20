import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import { env } from './env'
import { userRoutes } from './routes/users'
import { signupRoute } from './routes/singup'

export const fastify = Fastify({
  logger: env.NODE_ENV === 'development'
})

void fastify.register(jwt, { secret: env.JWT_SECRET })
void fastify.register(signupRoute, { prefix: 'signup' })
void fastify.register(userRoutes, { prefix: 'users' })
