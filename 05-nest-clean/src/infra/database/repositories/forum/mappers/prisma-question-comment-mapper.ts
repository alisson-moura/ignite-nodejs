import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { Prisma, Comment as PrismaQuestionComment } from '@prisma/client';

export class PrismaQuestionCommentMapper {
    static toDomain(raw: PrismaQuestionComment): QuestionComment {
        if(raw.questionId == null) throw new Error('Invalid comment type')

        return QuestionComment.create(
            {
                content: raw.content,
                questionId: new UniqueEntityId(raw.questionId),
                authorId: new UniqueEntityId(raw.authorId),
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt
            },
            new UniqueEntityId(raw.id),
        );
    }

    static toPrisma(comment: QuestionComment): Prisma.CommentUncheckedCreateInput {
        return {
            id: comment.id.toString(),
            questionId: comment.questionId.toString(),
            authorId: comment.authorId.toString(),
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
        };
    }
}
