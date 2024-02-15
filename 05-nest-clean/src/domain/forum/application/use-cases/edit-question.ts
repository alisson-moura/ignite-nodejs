import { type Either, left, right } from '@/core/either';
import { QuestionsRepository } from '../repositories/question-repository';
import { NotAllowedError } from './errors/not-allowed';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { QuestionAttachmentRepository } from '../repositories/question-attachment-repository';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface Request {
  questionId: string;
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type Response = Either<ResourceNotFoundError | NotAllowedError, void>;

export class EditQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionsRepository,
    private readonly attachmentRepository: QuestionAttachmentRepository,
  ) {}

  public async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: Request): Promise<Response> {
    const question = await this.questionRepository.findById(questionId);

    if (question == null) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const currentAttachments =
      await this.attachmentRepository.findManyByQuestionId(
        question.id.toString(),
      );
    const attachmentList = new QuestionAttachmentList(currentAttachments);
    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      });
    });
    attachmentList.update(questionAttachments);

    question.title = title;
    question.content = content;
    question.attachments = attachmentList;

    await this.questionRepository.save(question);
    return right(undefined);
  }
}
