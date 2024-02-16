import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaQuestionMapper } from './mappers/prisma-question-mapper';
import { PaginationParams } from '@/core/repositories/pagination';

@Injectable()
export class PrismaQuestionRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}
  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);
    await this.prisma.question.create({ data });
  }
  async findBySlug(slug: string): Promise<Question | null> {
    const dbQuestion = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    });
    if (dbQuestion) {
      return PrismaQuestionMapper.toDomain(dbQuestion);
    }
    return null;
  }
  async findById(id: string): Promise<Question | null> {
    const dbQuestion = await this.prisma.question.findUnique({
      where: {
        id,
      },
    });
    if (dbQuestion) {
      return PrismaQuestionMapper.toDomain(dbQuestion);
    }
    return null;
  }
  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: {
        id: question.id.toString(),
      },
    });
  }
  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);
    await this.prisma.question.update({
      data,
      where: {
        id: question.id.toString(),
      },
    });
  }
  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    const dbQuestions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return dbQuestions.map(PrismaQuestionMapper.toDomain);
  }
}
