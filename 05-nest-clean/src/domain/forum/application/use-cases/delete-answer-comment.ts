import { left, type Either, right } from '@/core/either';
import { AnswerCommentRepository } from '../repositories/answers-comments-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { NotAllowedError } from './errors/not-allowed';

interface Request {
  commentId: string;
  authorId: string;
}

type Response = Either<ResourceNotFoundError | NotAllowedError, void>;

export class DeleteAnswerCommentUseCase {
  constructor(private readonly commentRepository: AnswerCommentRepository) {}

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
