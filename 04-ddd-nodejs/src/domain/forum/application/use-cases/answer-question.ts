import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import { type CreateAnswerRepository } from '../repositories/answers-repository';

interface Request {
  instructorId: string
  questionId: string
  content: string
}

interface Response {
  answer: Answer
}

export class AnswerQuestionUseCase {
  constructor (
    private readonly answersRepository: CreateAnswerRepository
  ) { }

  public async execute ({
    instructorId, content, questionId
  }: Request): Promise<Response> {
    const answer = Answer.create({
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
      content
    });

    await this.answersRepository.create(answer);
    return { answer };
  }
}
