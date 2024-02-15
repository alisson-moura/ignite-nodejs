import { type Either, left, right } from '@/core/either';
import { QuestionCommentRepository } from '../repositories/question-comment-repository';
import { NotAllowedError } from './errors/not-allowed';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface Request {
  commentId: string;
  authorId: string;
}

type Response = Either<ResourceNotFoundError | NotAllowedError, void>;

export class DeleteQuestionCommentUseCase {
  constructor(private readonly commentRepository: QuestionCommentRepository) {}

  public async execute({ authorId, commentId }: Request): Promise<Response> {
    const comment = await this.commentRepository.findById(commentId);
    if (comment == null) {
      return left(new ResourceNotFoundError());
    }
    if (comment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }
    await this.commentRepository.delete(comment);
    return right(undefined);
  }
}
