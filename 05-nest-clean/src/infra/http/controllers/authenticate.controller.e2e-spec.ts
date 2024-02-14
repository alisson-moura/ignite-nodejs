import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';

describe('(E2E) Controller Authenticate', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  test('[POST] /sessions', async () => {
    await request(app.getHttpServer()).post('/accounts').send({
      name: 'john doe',
      email: 'john@mail.com',
      password: 'fake_password',
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john@mail.com',
      password: 'fake_password',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
