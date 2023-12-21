import { type FindQuestionCommentByIdRepository, type DeleteQuestionCommentRepository } from '../repositories/question-comment-repository';

interface Request {
  commentId: string
  authorId: string
}

type Response = Promise<void>;

export class DeleteQuestionCommentUseCase {
  constructor (
    private readonly commentRepository: FindQuestionCommentByIdRepository
    & DeleteQuestionCommentRepository
  ) { }

  public async execute ({
    authorId, commentId
  }: Request): Response {
    const comment = await this.commentRepository.find(commentId);
    if (comment == null) {
      throw new Error('Invalid commentId');
    }
    if (comment.authorId.toString() !== authorId) {
      throw new Error('Not Allowed');
    }
    await this.commentRepository.delete(comment);
  }
}
