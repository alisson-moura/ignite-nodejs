import { type Either, left, right } from '@/core/either';
import { type DeleteQuestionRepository, type FindQuestionByIdRepository } from '../repositories/question-repository';
import { NotAllowedError } from './errors/not-allowed';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface Request {
  questionId: string
  authorId: string
}

type Response = Either<ResourceNotFoundError | NotAllowedError, void>;

export class DeleteQuestionUseCase {
  constructor (
    private readonly questionRepository: FindQuestionByIdRepository
    & DeleteQuestionRepository
  ) { }

  public async execute ({ authorId, questionId }: Request): Promise<Response> {
    const question = await this.questionRepository.find(questionId);

    if (question == null) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.questionRepository.delete(question);
    return right(undefined);
  }
}
