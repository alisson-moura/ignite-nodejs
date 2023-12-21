import { type AnswerComment } from '../../enterprise/entities/answer-comment';
import { type FindManyByAnswerIdRepository } from '../repositories/answers-comments-repository';

interface Request {
  page: number
  answerId: string
}

interface Response {
  comments: AnswerComment[]
}

export class FetchAnswerCommentsUseCase {
  constructor (private readonly commentsRepository: FindManyByAnswerIdRepository) {}

  async execute ({
    answerId,
    page
  }: Request): Promise<Response> {
    const comments = await this.commentsRepository.findMany(answerId, { page });

    return {
      comments
    };
  }
}
