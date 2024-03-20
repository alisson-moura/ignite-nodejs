import { type Either, left, right } from '@/core/either';
import { type Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/question-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { Injectable } from '@nestjs/common';

interface Request {
  slug: string;
}

type Response = Either<ResourceNotFoundError, { question: Question }>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private readonly questionRepository: QuestionsRepository) {}

  public async execute({ slug }: Request): Promise<Response> {
    const question = await this.questionRepository.findBySlug(slug);

    if (question == null) {
      return left(new ResourceNotFoundError());
    }
    return right({ question });
  }
}
