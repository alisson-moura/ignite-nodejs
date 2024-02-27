import { PaginationParams } from '@/core/repositories/pagination';
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answers-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaAnswerCommentMapper } from './mappers/prisma-answer-comment-mapper';

@Injectable()
export class PrismaAnswerCommentRepository implements AnswerCommentRepository {
  constructor(private prisma: PrismaService) {}

  async create(comment: AnswerComment): Promise<void> {
    const prismaComment = PrismaAnswerCommentMapper.toPrisma(comment);
    await this.prisma.comment.create({
      data: prismaComment,
    });
  }
  async findById(id: string): Promise<AnswerComment | null> {
    const prismaComment = await this.prisma.comment.findFirst({
      where: {
        id,
      },
    });

    if (prismaComment) return PrismaAnswerCommentMapper.toDomain(prismaComment);

    return null;
  }
  async delete(comment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: comment.id.toString(),
      },
    });
  }

  async findManyByAnswerId(
    answerId: string,
    pagination: PaginationParams,
  ): Promise<AnswerComment[]> {
    const prismaComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      skip: (pagination.page - 1) * 20,
      take: 20,
    });
    return prismaComments.map(PrismaAnswerCommentMapper.toDomain);
  }
}
