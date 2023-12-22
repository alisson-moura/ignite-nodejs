import { type Either, left, right } from '@/core/either';
import { type Answer } from '../../enterprise/entities/answer';
import { type FindAnswerByIdRepository, type SaveAnswerRepository } from '../repositories/answers-repository';
import { NotAllowedError } from './errors/not-allowed';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface Request {
  answerId: string
  authorId: string
  content: string
}

type Response = Either<ResourceNotFoundError | NotAllowedError, {
  answer: Answer
}>;

export class EditAnswerUseCase {
  constructor (
    private readonly AnswerRepository: FindAnswerByIdRepository
    & SaveAnswerRepository
  ) { }

  public async execute ({ authorId, answerId, content }: Request): Promise<Response> {
    const answer = await this.AnswerRepository.find(answerId);

    if (answer == null) {
      return left(new ResourceNotFoundError());
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    answer.content = content;
    await this.AnswerRepository.save(answer);
    return right({
      answer
    });
  }
}
