import { left, type Either, right } from '@/core/either';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { type CreateQuestionCommentRepository } from '../repositories/question-comment-repository';
import { type FindQuestionByIdRepository } from '../repositories/question-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface Request {
  questionId: string;
  authorId: string;
  content: string;
}

type Response = Either<
  ResourceNotFoundError,
  {
    comment: QuestionComment;
  }
>;

export class CommentOnQuestionUseCase {
  constructor(
    private readonly questionRepository: FindQuestionByIdRepository,
    private readonly commentRepository: CreateQuestionCommentRepository,
  ) {}

  public async execute({
    authorId,
    content,
    questionId,
  }: Request): Promise<Response> {
    const question = await this.questionRepository.find(questionId);
    if (question == null) {
      return left(new ResourceNotFoundError());
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content,
    });

    await this.commentRepository.create(questionComment);

    return right({
      comment: questionComment,
    });
  }
}
