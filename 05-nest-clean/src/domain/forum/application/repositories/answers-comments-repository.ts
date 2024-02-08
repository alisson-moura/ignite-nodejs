import { type PaginationParams } from '../../../../core/repositories/pagination';
import { type AnswerComment } from '../../enterprise/entities/answer-comment';

export interface AnswerCommentRepository
  extends CreateAnswerCommentRepository,
    FindAnswerCommentByIdRepository,
    DeleteAnswerCommentRepository,
    FindManyByAnswerIdRepository {}

export interface CreateAnswerCommentRepository {
  create: (comment: AnswerComment) => Promise<void>;
}

export interface FindAnswerCommentByIdRepository {
  find: (id: string) => Promise<AnswerComment | null>;
}

export interface DeleteAnswerCommentRepository {
  delete: (comment: AnswerComment) => Promise<void>;
}

export interface FindManyByAnswerIdRepository {
  findMany: (
    answerId: string,
    pagination: PaginationParams,
  ) => Promise<AnswerComment[]>;
}
