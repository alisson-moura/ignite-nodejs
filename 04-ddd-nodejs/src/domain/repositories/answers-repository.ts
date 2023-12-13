import { type Answer } from '../entities/answer';

export interface AnswersRepository extends
  CreateAnswerRepository {}

export interface CreateAnswerRepository {
  create: (answer: Answer) => Promise<void>
}
