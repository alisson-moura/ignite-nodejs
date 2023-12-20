import { type FindByQuestionIdRepository } from '../repositories/answers-repository';
import { type Answer } from '../../enterprise/entities/answer';

interface Request {
  page: number
  questionId: string
}

interface Response {
  answers: Answer[]
}

export class FetchQuestionAnswersUseCase {
  constructor (private readonly answersRepository: FindByQuestionIdRepository) {}

  async execute ({
    page,
    questionId
  }: Request): Promise<Response> {
    const answers = await this.answersRepository.findByQuestion(questionId, { page });

    return {
      answers
    };
  }
}
