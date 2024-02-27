import { PaginationParams } from '@/core/repositories/pagination';
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaQuestionCommentMapper } from './mappers/prisma-question-comment-mapper';

@Injectable()
export class PrismaQuestionCommentRepository
  implements QuestionCommentRepository
{
  constructor(private prisma: PrismaService) {}
  async create(comment: QuestionComment): Promise<void> {
    const prismaComment = PrismaQuestionCommentMapper.toPrisma(comment);
    await this.prisma.comment.create({
      data: prismaComment,
    });
  }
  async findById(id: string): Promise<QuestionComment | null> {
    const prismaComment = await this.prisma.comment.findFirst({
      where: {
        id,
      },
    });

    if (prismaComment)
      return PrismaQuestionCommentMapper.toDomain(prismaComment);

    return null;
  }
  async delete(comment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: comment.id.toString(),
      },
    });
  }
  async findManyByQuestionId(
    questionId: string,
    pagination: PaginationParams,
  ): Promise<QuestionComment[]> {
    const prismaComments = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      skip: (pagination.page - 1) * 20,
      take: 20,
    });
    return prismaComments.map(PrismaQuestionCommentMapper.toDomain);
  }
}
