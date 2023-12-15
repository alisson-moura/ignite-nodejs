import { type Question } from '../../enterprise/entities/question';

export interface QuestionRepository extends
  CreateQuestionRepository,
  FindQuestionBySlugRepository,
  FindQuestionByIdRepository,
  DeleteQuestionRepository { }

export interface CreateQuestionRepository {
  create: (question: Question) => Promise<void>
}

export interface SaveQuestionRepository {
  save: (question: Question) => Promise<void>
}

export interface FindQuestionBySlugRepository {
  find: (slug: string) => Promise<Question | null>
}

export interface FindQuestionByIdRepository {
  find: (id: string) => Promise<Question | null>
}
export interface DeleteQuestionRepository {
  delete: (question: Question) => Promise<void>
}
