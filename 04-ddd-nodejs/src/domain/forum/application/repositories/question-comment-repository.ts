import { type QuestionComment } from '../../enterprise/entities/question-comment';

export interface QuestionCommentRepository extends
  CreateQuestionCommentRepository
{ }

export interface CreateQuestionCommentRepository {
  create: (comment: QuestionComment) => Promise<void>
}
