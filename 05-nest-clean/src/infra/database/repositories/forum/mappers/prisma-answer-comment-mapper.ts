import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { Prisma, Comment as PrismaAnswerComment } from '@prisma/client';

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaAnswerComment): AnswerComment {
    if (raw.answerId == null) throw new Error('Invalid comment type');

    return AnswerComment.create(
      {
        content: raw.content,
        answerId: new UniqueEntityId(raw.answerId),
        authorId: new UniqueEntityId(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(comment: AnswerComment): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      answerId: comment.answerId.toString(),
      authorId: comment.authorId.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
