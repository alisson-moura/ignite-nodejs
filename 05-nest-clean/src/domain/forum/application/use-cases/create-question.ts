import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { right, type Either } from '@/core/either';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { Injectable } from '@nestjs/common';
import { CreateQuestionRepository} from '../repositories/question-repository';

interface Request {
  authorId: string;
  content: string;
  title: string;
  attachmentsIds: string[];
}
type Response = Either<
  null,
  {
    question: Question;
  }
>;

@Injectable()
export class CreateQuestionUseCase {
  constructor(private readonly questionRepository: CreateQuestionRepository) {}

  public async execute({
    authorId,
    content,
    title,
    attachmentsIds,
  }: Request): Promise<Response> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    });

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      });
    });

    question.attachments = new QuestionAttachmentList(questionAttachments);

    await this.questionRepository.create(question);
    return right({ question });
  }
}
