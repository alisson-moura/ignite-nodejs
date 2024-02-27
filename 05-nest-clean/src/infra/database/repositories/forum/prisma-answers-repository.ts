import { PaginationParams } from '@/core/repositories/pagination';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaAnswerMapper } from './mappers/prisma-answer-mapper';

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);
    await this.prisma.answer.create({ data });
  }
  async findById(id: string): Promise<Answer | null> {
    const dbAnswer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });
    if (dbAnswer) {
      return PrismaAnswerMapper.toDomain(dbAnswer);
    }
    return null;
  }
  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    });
  }
  async save(answer: Answer): Promise<void> {
    const dbAnswer = PrismaAnswerMapper.toPrisma(answer);
    await this.prisma.answer.update({
      where: {
        id: dbAnswer.id,
      },
      data: dbAnswer,
    });
  }
  async findManyByQuestionId(
    questionId: string,
    pagination: PaginationParams,
  ): Promise<Answer[]> {
    const dbAnswers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      skip: (pagination.page - 1) * 20,
      take: 20,
    });
    return dbAnswers.map(PrismaAnswerMapper.toDomain);
  }
}
