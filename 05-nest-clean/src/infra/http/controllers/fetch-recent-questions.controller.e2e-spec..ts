import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';

describe('(E2E) Controller Fetch Recent Questions', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();

    // create account
    await request(app.getHttpServer()).post('/accounts').send({
      name: 'john doe',
      email: 'john@mail.com',
      password: 'fake_password',
    });

    // get access token
    const { body } = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john@mail.com',
      password: 'fake_password',
    });
    accessToken = body.access_token;

    // create a question
    await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'fake question',
        content: 'an fake question',
      });
  });

  test('[GET] /questions', async () => {
    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      questions: [expect.objectContaining({ title: 'fake question' })],
    });
  });
});
