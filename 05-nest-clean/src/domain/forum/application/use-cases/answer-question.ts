import { right, type Either, left } from '@/core/either';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { QuestionsRepository } from '../repositories/question-repository';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';

interface Request {
  instructorId: string;
  questionId: string;
  content: string;
  attachmentsIds: string[];
}

type Response = Either<ResourceNotFoundError, { answer: Answer }>;

export class AnswerQuestionUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly questionRepository: QuestionsRepository,
  ) {}

  public async execute({
    instructorId,
    content,
    questionId,
    attachmentsIds,
  }: Request): Promise<Response> {
    const question = await this.questionRepository.findById(questionId);
    if (question == null) {
      return left(new ResourceNotFoundError());
    }

    const answer = Answer.create({
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
      content,
    });

    const attachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      });
    });

    answer.attachments = new AnswerAttachmentList(attachments);

    await this.answersRepository.create(answer);
    return right({ answer });
  }
}
