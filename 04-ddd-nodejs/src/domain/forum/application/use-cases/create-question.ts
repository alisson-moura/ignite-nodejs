import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { type CreateQuestionRepository } from '../repositories/question-repository';
import { right, type Either } from '@/core/either';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';

interface Request {
  authorId: string
  content: string
  title: string
  attachmentsIds: string[]
}
type Response = Either<null, {
  question: Question
}>;

export class CreateQuestionUseCase {
  constructor (
    private readonly questionRepository: CreateQuestionRepository
  ) { }

  public async execute ({ authorId, content, title, attachmentsIds }: Request): Promise<Response> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content
    });

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id
      });
    });

    question.attachments = questionAttachments;

    await this.questionRepository.create(question);
    return right({ question });
  }
}
