import { type PaginationParams } from '../../../../core/repositories/pagination';
import { type QuestionComment } from '../../enterprise/entities/question-comment';

export abstract class QuestionCommentRepository {
  abstract create: (comment: QuestionComment) => Promise<void>;
  abstract findById: (id: string) => Promise<QuestionComment | null>;
  abstract delete: (comment: QuestionComment) => Promise<void>;
  abstract findManyByQuestionId: (
    questionId: string,
    pagination: PaginationParams,
  ) => Promise<QuestionComment[]>;
}
