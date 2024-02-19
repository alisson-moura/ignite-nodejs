import { Test, TestingModule } from '@nestjs/testing';
import { JwtEncrypter } from './jwt-encrypter';

describe('JwtEncrypter', () => {
  let provider: JwtEncrypter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtEncrypter],
    }).compile();

    provider = module.get<JwtEncrypter>(JwtEncrypter);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
