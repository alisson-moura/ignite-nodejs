import { type CheckIn } from '@prisma/client';
import { type CheckInsRepository } from '@/repositories/check-in-repository';
import { type GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

interface Request {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
};

interface Response {
  checkIn: CheckIn
}

export class CheckInUseCase {
  private readonly MAX_DISTANCE_IN_KILOMETERS = 0.1;
  constructor (
    private readonly checkInsRepository: CheckInsRepository,
    private readonly gymsRepository: GymsRepository
  ) {}

  async execute ({ gymId, userId, userLatitude, userLongitude }: Request): Promise<Response> {
    const checkInOnSameDate = await this.checkInsRepository.findByUserOnDate({
      userId,
      date: new Date()
    });

    if (checkInOnSameDate != null) {
      throw new Error();
    }

    const gym = await this.gymsRepository.findById(gymId);
    if (gym == null) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    );

    if (distance > this.MAX_DISTANCE_IN_KILOMETERS) {
      throw new Error();
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId, user_id: userId
    });

    return {
      checkIn
    };
  }
}
