import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { type CreateAnswerCommentRepository } from '../repositories/answers-comments-repository';
import { type FindAnswerByIdRepository } from '../repositories/answers-repository';

interface Request {
  answerId: string
  authorId: string
  content: string
}

interface Response {
  comment: AnswerComment
}

export class CommentOnAnswerUseCase {
  constructor (
    private readonly answerRepository: FindAnswerByIdRepository,
    private readonly commentRepository: CreateAnswerCommentRepository
  ) { }

  public async execute ({
    authorId, content, answerId
  }: Request): Promise<Response> {
    const answer = await this.answerRepository.find(answerId);
    if (answer == null) {
      throw new Error('Invalid answer');
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content
    });

    await this.commentRepository.create(answerComment);

    return {
      comment: answerComment
    };
  }
}
