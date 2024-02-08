import { type FindByQuestionIdRepository } from '../repositories/answers-repository';
import { type Answer } from '../../enterprise/entities/answer';
import { right, type Either } from '@/core/either';

interface Request {
  page: number;
  questionId: string;
}

type Response = Either<null, { answers: Answer[] }>;

export class FetchQuestionAnswersUseCase {
  constructor(private readonly answersRepository: FindByQuestionIdRepository) {}

  async execute({ page, questionId }: Request): Promise<Response> {
    const answers = await this.answersRepository.findByQuestion(questionId, {
      page,
    });

    return right({
      answers,
    });
  }
}
