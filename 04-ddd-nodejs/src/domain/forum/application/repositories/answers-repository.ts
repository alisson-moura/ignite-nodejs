import { type Answer } from '../../enterprise/entities/answer';

export interface AnswersRepository extends
  CreateAnswerRepository,
  FindAnswerByIdRepository,
  DeleteAnswerRepository { }

export interface CreateAnswerRepository {
  create: (answer: Answer) => Promise<void>
}

export interface FindAnswerByIdRepository {
  find: (id: string) => Promise<Answer | null>
}

export interface DeleteAnswerRepository {
  delete: (answer: Answer) => Promise<void>
}
