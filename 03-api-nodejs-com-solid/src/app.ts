import fastify from 'fastify';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { privateRoutes, publicRoutes } from './http/routes';
import { ZodError } from 'zod';
import { env } from './env';

export const app = fastify();
void app.register(jwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false
  },
  sign: {
    expiresIn: '10m'
  }
});

void app.register(cookie);
void app.register(privateRoutes);
void app.register(publicRoutes);

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format()
    });
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }
  return reply.status(500).send({
    message: 'Internal server error.'
  });
});
