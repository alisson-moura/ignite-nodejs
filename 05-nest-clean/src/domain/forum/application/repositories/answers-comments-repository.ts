import { type PaginationParams } from '../../../../core/repositories/pagination';
import { type AnswerComment } from '../../enterprise/entities/answer-comment';

export abstract class AnswerCommentRepository {
  abstract create: (comment: AnswerComment) => Promise<void>;
  abstract findById: (id: string) => Promise<AnswerComment | null>;
  abstract delete: (comment: AnswerComment) => Promise<void>;
  abstract findManyByAnswerId: (answerId: string, pagination: PaginationParams) => Promise<AnswerComment[]>;
}
