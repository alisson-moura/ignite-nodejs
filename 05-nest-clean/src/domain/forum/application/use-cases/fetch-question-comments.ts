import { type Either, right } from '@/core/either';
import { type QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentRepository } from '../repositories/question-comment-repository';

interface Request {
  page: number;
  questionId: string;
}

type Response = Either<null, { comments: QuestionComment[] }>;

export class FetchQuestionCommentsUseCase {
  constructor(private readonly commentsRepository: QuestionCommentRepository) {}

  async execute({ questionId, page }: Request): Promise<Response> {
    const comments = await this.commentsRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    );

    return right({
      comments,
    });
  }
}
