import { type FastifyReply, type FastifyRequest } from 'fastify';

export async function refresh (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> {
  await request.jwtVerify({ onlyCookie: true });

  const token = await reply.jwtSign({}, {
    sign: {
      sub: request.user.sub
    }
  });
  const refreshToken = await reply.jwtSign({}, {
    sign: {
      sub: request.user.sub,
      expiresIn: '7d'
    }
  });
  return await reply.status(200)
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      sameSite: true,
      secure: true,
      httpOnly: true
    })
    .send({ token });
}
