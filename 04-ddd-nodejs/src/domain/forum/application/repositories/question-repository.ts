import { type Question } from '../../enterprise/entities/question';

export interface QuestionRepository extends
  CreateQuestionRepository {}

export interface CreateQuestionRepository {
  create: (question: Question) => Promise<void>
}
