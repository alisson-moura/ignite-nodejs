import { type QuestionComment } from '../../enterprise/entities/question-comment';
import { type FindManyByQuestionIdRepository } from '../repositories/question-comment-repository';

interface Request {
  page: number
  questionId: string
}

interface Response {
  comments: QuestionComment[]
}

export class FetchQuestionCommentsUseCase {
  constructor (private readonly commentsRepository: FindManyByQuestionIdRepository) {}

  async execute ({
    questionId,
    page
  }: Request): Promise<Response> {
    const comments = await this.commentsRepository.findMany(questionId, { page });

    return {
      comments
    };
  }
}
