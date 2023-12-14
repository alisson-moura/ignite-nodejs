import { type Question } from '../../enterprise/entities/question';
import { type FindQuestionBySlugRepository } from '../repositories/question-repository';

interface Request {
  slug: string
}
interface Response {
  question: Question
}

export class GetQuestionBySlugUseCase {
  constructor (
    private readonly questionRepository: FindQuestionBySlugRepository
  ) { }

  public async execute ({ slug }: Request): Promise<Response> {
    const question = await this.questionRepository.find(slug);

    if (question == null) {
      throw new Error('Question not found');
    }
    return { question };
  }
}
