import { type PaginationParams } from '../../../../core/repositories/pagination';
import { type Question } from '../../enterprise/entities/question';

export interface QuestionRepository
  extends CreateQuestionRepository,
    FindQuestionBySlugRepository,
    FindQuestionByIdRepository,
    DeleteQuestionRepository,
    SaveQuestionRepository {}

export interface CreateQuestionRepository {
  create: (question: Question) => Promise<void>;
}

export interface SaveQuestionRepository {
  save: (question: Question) => Promise<void>;
}

export interface FindQuestionBySlugRepository {
  findBySlug: (slug: string) => Promise<Question | null>;
}

export interface FindQuestionByIdRepository {
  findById: (id: string) => Promise<Question | null>;
}
export interface DeleteQuestionRepository {
  delete: (question: Question) => Promise<void>;
}

export interface FindManyRecentRepository {
  findMany: (params: PaginationParams) => Promise<Question[]>;
}
