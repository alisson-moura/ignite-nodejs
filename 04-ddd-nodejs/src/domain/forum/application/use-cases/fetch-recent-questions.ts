import { type Question } from '@/domain/forum/enterprise/entities/question';
import { type FindManyRecentRepository } from '../repositories/question-repository';

interface FetchRecentQuestionsUseCaseRequest {
  page: number
}

interface FetchRecentQuestionsUseCaseResponse {
  questions: Question[]
}

export class FetchRecentQuestionsUseCase {
  constructor (private readonly questionsRepository: FindManyRecentRepository) {}

  async execute ({
    page
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.find({ page });

    return {
      questions
    };
  }
}
