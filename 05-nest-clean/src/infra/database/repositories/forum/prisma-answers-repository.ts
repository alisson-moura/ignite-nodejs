import { PaginationParams } from '@/core/repositories/pagination';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  async create(answer: Answer): Promise<void> {}
  async findById(id: string): Promise<Answer | null> {
    return null;
  }
  async delete(answer: Answer): Promise<void> {}
  async save(answer: Answer): Promise<void> {}
  async findManyByQuestionId(
    questionId: string,
    pagination: PaginationParams,
  ): Promise<Answer[]> {
    return [];
  }
}
