import { type Question } from '../../enterprise/entities/question';

export interface QuestionRepository extends
  CreateQuestionRepository,
  FindQuestionBySlugRepository { }

export interface CreateQuestionRepository {
  create: (question: Question) => Promise<void>
}

export interface FindQuestionBySlugRepository {
  find: (slug: string) => Promise<Question | null>
}
