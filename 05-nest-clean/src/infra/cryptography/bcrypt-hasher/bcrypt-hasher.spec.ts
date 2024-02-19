import { Test, TestingModule } from '@nestjs/testing';
import { BcryptHasher } from './bcrypt-hasher';

describe('BcryptHasher', () => {
  let provider: BcryptHasher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptHasher],
    }).compile();

    provider = module.get<BcryptHasher>(BcryptHasher);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
