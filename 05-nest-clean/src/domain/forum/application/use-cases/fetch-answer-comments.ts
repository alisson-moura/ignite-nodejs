import { right, type Either } from '@/core/either';
import { type AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentRepository } from '../repositories/answers-comments-repository';

interface Request {
  page: number;
  answerId: string;
}

type Response = Either<null, { comments: AnswerComment[] }>;

export class FetchAnswerCommentsUseCase {
  constructor(private readonly commentsRepository: AnswerCommentRepository) {}

  async execute({ answerId, page }: Request): Promise<Response> {
    const comments = await this.commentsRepository.findManyByAnswerId(
      answerId,
      { page },
    );

    return right({
      comments,
    });
  }
}
