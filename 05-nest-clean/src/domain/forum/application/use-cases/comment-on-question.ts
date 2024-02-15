import { left, type Either, right } from '@/core/either';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentRepository } from '../repositories/question-comment-repository';
import { QuestionsRepository } from '../repositories/question-repository';
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
    private readonly questionRepository: QuestionsRepository,
    private readonly commentRepository: QuestionCommentRepository,
  ) {}

  public async execute({
    authorId,
    content,
    questionId,
  }: Request): Promise<Response> {
    const question = await this.questionRepository.findById(questionId);
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
