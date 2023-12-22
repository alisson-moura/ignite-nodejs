import { right, type Either, left } from '@/core/either';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import { type CreateAnswerRepository } from '../repositories/answers-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { type FindQuestionByIdRepository } from '../repositories/question-repository';

interface Request {
  instructorId: string
  questionId: string
  content: string
}

type Response = Either<ResourceNotFoundError, { answer: Answer }>;

export class AnswerQuestionUseCase {
  constructor (
    private readonly answersRepository: CreateAnswerRepository,
    private readonly questionRepository: FindQuestionByIdRepository
  ) { }

  public async execute ({
    instructorId, content, questionId
  }: Request): Promise<Response> {
    const question = await this.questionRepository.find(questionId);
    if (question == null) {
      return left(new ResourceNotFoundError());
    }

    const answer = Answer.create({
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
      content
    });

    await this.answersRepository.create(answer);
    return right({ answer });
  }
}
