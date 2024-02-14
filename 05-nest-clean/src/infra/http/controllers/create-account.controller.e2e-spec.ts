import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('(E2E) Controller Create Account', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    await app.init();
  });

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'john doe',
      email: 'john@mail.com',
      password: 'fake_password',
    });

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'john@mail.com',
      },
    });

    expect(response.statusCode).toBe(201);
    expect(userOnDatabase).toBeTruthy();
  });
});
