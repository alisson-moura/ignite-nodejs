import { type PaginationParams } from '../../../../core/repositories/pagination';
import { type Answer } from '../../enterprise/entities/answer';

export abstract class AnswersRepository {
  abstract create: (answer: Answer) => Promise<void>;
  abstract findById: (id: string) => Promise<Answer | null>;
  abstract delete: (answer: Answer) => Promise<void>;
  abstract save: (answer: Answer) => Promise<void>;
  abstract findManyByQuestionId: (
    questionId: string,
    pagination: PaginationParams,
  ) => Promise<Answer[]>;
}
