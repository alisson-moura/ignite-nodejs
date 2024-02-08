import { type Either, left, right } from '@/core/either';
import { type Question } from '../../enterprise/entities/question';
import { type FindQuestionBySlugRepository } from '../repositories/question-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface Request {
  slug: string
}

type Response = Either<ResourceNotFoundError, { question: Question }>;

export class GetQuestionBySlugUseCase {
  constructor (
    private readonly questionRepository: FindQuestionBySlugRepository
  ) { }

  public async execute ({ slug }: Request): Promise<Response> {
    const question = await this.questionRepository.find(slug);

    if (question == null) {
      return left(new ResourceNotFoundError());
    }
    return right({ question });
  }
}
