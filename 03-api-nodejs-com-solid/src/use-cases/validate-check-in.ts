import { type CheckInsRepository } from '@/repositories/check-in-repository';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { type CheckIn } from '@prisma/client';
import dayjs from 'dayjs';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor (private readonly checkInsRepository: CheckInsRepository) {}

  async execute ({
    checkInId
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (checkIn == null) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date())
      .diff(checkIn.created_at, 'minutes');
    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validate_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn
    };
  }
}
