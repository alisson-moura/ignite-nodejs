import { type Answer } from '../../enterprise/entities/answer';

export interface AnswersRepository extends
  CreateAnswerRepository {}

export interface CreateAnswerRepository {
  create: (answer: Answer) => Promise<void>
}
