import { type PaginationParams } from '@/core/repositories/pagination';
import { type QuestionComment } from '../../enterprise/entities/question-comment';

export interface QuestionCommentRepository extends
  CreateQuestionCommentRepository,
  FindQuestionCommentByIdRepository,
  DeleteQuestionCommentRepository,
  FindManyByQuestionIdRepository { }

export interface CreateQuestionCommentRepository {
  create: (comment: QuestionComment) => Promise<void>
}

export interface FindQuestionCommentByIdRepository {
  find: (id: string) => Promise<QuestionComment | null>
}

export interface DeleteQuestionCommentRepository {
  delete: (comment: QuestionComment) => Promise<void>
}

export interface FindManyByQuestionIdRepository {
  findMany: (questionId: string, pagination: PaginationParams) => Promise<QuestionComment[]>
}
