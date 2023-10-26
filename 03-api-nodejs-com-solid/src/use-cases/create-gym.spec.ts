import { expect, it, describe, beforeEach } from 'vitest';
import { CreateGymUseCase } from './create-gym';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let sut: CreateGymUseCase;
describe('Create Gym Use Case', () => {
  beforeEach(() => {
    const gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('should  be able to create an gym', async () => {
    const fakeRequest = {
      title: 'fake name',
      description: 'an fake description',
      phone: 'fake_phone',
      latitude: 0,
      longitude: 0
    };
    const { gym } = await sut.execute(fakeRequest);

    expect(gym.id).toEqual(expect.any(String));
    expect(gym.title).toEqual(fakeRequest.title);
  });
});
