import { type FindAnswerByIdRepository } from '../repositories/answers-repository';
import { type FindQuestionByIdRepository, type SaveQuestionRepository } from '../repositories/question-repository';
import { type Question } from '../../enterprise/entities/question';
import { left, type Either, right } from '@/core/either';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { NotAllowedError } from './errors/not-allowed';

interface Request {
  answerId: string
  authorId: string
}

type Response = Either<ResourceNotFoundError | NotAllowedError, {
  question: Question
}>;

export class ChoseQuestionBestAnswer {
  constructor (
    private readonly answersRepository: FindAnswerByIdRepository,
    private readonly questionRepository: FindQuestionByIdRepository &
    SaveQuestionRepository
  ) { }

  public async execute ({ answerId, authorId }: Request): Promise<Response> {
    const answer = await this.answersRepository.find(answerId);
    if (answer == null) {
      return left(new ResourceNotFoundError());
    }

    const question = await this.questionRepository
      .find(answer.questionId.toString());
    if (question == null) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;
    await this.questionRepository.save(question);

    return right({ question });
  }
}
