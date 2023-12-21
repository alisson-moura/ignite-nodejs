import { type AnswerComment } from '../../enterprise/entities/answer-comment';

export interface AnswerCommentRepository extends
  CreateAnswerCommentRepository
{ }

export interface CreateAnswerCommentRepository {
  create: (comment: AnswerComment) => Promise<void>
}
