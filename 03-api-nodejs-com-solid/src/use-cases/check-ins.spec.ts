import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-ins';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { type GymsRepository } from '@/repositories/gyms-repository';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';

let sut: CheckInUseCase;
let gymId: string;
let gymsRepository: GymsRepository;
describe('Check In Use Case', () => {
  beforeEach(async () => {
    const checkInRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);

    const gym = await gymsRepository.create({
      description: 'fake_gym',
      latitude: 0,
      longitude: 0,
      title: 'js gym'
    });
    gymId = gym.id;

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should  be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId,
      userId: 'fake_id',
      userLatitude: 0,
      userLongitude: 0
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 25, 0, 0));
    await sut.execute({
      gymId,
      userId: 'fake_id',
      userLatitude: 0,
      userLongitude: 0
    });

    await expect(sut.execute({
      gymId,
      userId: 'fake_id',
      userLatitude: 0,
      userLongitude: 0
    })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should  be able to check in in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 25, 0, 0));
    await sut.execute({
      gymId,
      userId: 'fake_id',
      userLatitude: 0,
      userLongitude: 0
    });

    vi.setSystemTime(new Date(2023, 0, 26, 0, 0));
    const { checkIn } = await sut.execute({
      gymId,
      userId: 'fake_id',
      userLatitude: 0,
      userLongitude: 0
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in at a non-existing gym.', async () => {
    await expect(sut.execute({
      gymId: 'wrong_gym_id',
      userId: 'fake_id',
      userLatitude: 0,
      userLongitude: 0
    })).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to check in on distant gym.', async () => {
    const gym = await gymsRepository.create({
      description: 'fake_gym',
      latitude: -20.8329029,
      longitude: -49.3957846,
      title: 'js gym'
    });

    await expect(sut.execute({
      gymId: gym.id,
      userId: 'fake_id',
      userLatitude: -20.833665,
      userLongitude: -49.3780176
    })).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
