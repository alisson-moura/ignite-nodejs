import { type Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionsRepository } from '../repositories/question-repository';
import { type Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}

type Response = Either<null, { questions: Question[] }>;

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<Response> {
    const questions = await this.questionsRepository.findManyRecent({ page });

    return right({
      questions,
    });
  }
}
