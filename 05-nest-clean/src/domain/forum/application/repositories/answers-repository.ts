import { type PaginationParams } from '../../../../core/repositories/pagination';
import { type Answer } from '../../enterprise/entities/answer';

export interface AnswersRepository
  extends CreateAnswerRepository,
    FindAnswerByIdRepository,
    DeleteAnswerRepository,
    SaveAnswerRepository,
    FindByQuestionIdRepository {}

export interface CreateAnswerRepository {
  create: (answer: Answer) => Promise<void>;
}

export interface SaveAnswerRepository {
  save: (answer: Answer) => Promise<void>;
}

export interface FindAnswerByIdRepository {
  find: (id: string) => Promise<Answer | null>;
}

export interface FindByQuestionIdRepository {
  findByQuestion: (
    questionId: string,
    pagination: PaginationParams,
  ) => Promise<Answer[]>;
}

export interface DeleteAnswerRepository {
  delete: (answer: Answer) => Promise<void>;
}
