import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('(E2E) Controller Create Question', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
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
  });

  test('[POST] /questions', async () => {
    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'fake question',
        content: 'an fake question',
      });

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'fake question',
      },
    });

    expect(response.statusCode).toBe(201);
    expect(questionOnDatabase).toBeTruthy();
  });
});
