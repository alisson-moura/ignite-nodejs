import { AnswersRepository } from '../repositories/answers-repository';
import { type Answer } from '../../enterprise/entities/answer';
import { right, type Either } from '@/core/either';

interface Request {
  page: number;
  questionId: string;
}

type Response = Either<null, { answers: Answer[] }>;

export class FetchQuestionAnswersUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({ page, questionId }: Request): Promise<Response> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    );

    return right({
      answers,
    });
  }
}
