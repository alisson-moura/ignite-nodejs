import { type Question } from '@/domain/forum/enterprise/entities/question';
import { type FindManyRecentRepository } from '../repositories/question-repository';
import { type Either, right } from '@/core/either';

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}

type Response = Either<null, { questions: Question[] }>;

export class FetchRecentQuestionsUseCase {
  constructor(private readonly questionsRepository: FindManyRecentRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<Response> {
    const questions = await this.questionsRepository.find({ page });

    return right({
      questions,
    });
  }
}
