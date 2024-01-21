import { type Either, left, right } from '@/core/either';
import { type Answer } from '../../enterprise/entities/answer';
import { type FindAnswerByIdRepository, type SaveAnswerRepository } from '../repositories/answers-repository';
import { NotAllowedError } from './errors/not-allowed';
import { ResourceNotFoundError } from './errors/resource-not-found';
import {  FindAttachmentByAnswerIdRepository } from '../repositories/answer-attachment-repository';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface Request {
  answerId: string
  authorId: string
  content: string
  attachmentsIds: string[]
}

type Response = Either<ResourceNotFoundError | NotAllowedError, {
  answer: Answer
}>;

export class EditAnswerUseCase {
  constructor(
    private readonly answerRepository: FindAnswerByIdRepository
      & SaveAnswerRepository,
    private readonly attachmentRepository: FindAttachmentByAnswerIdRepository
  ) { }

  public async execute({ authorId, answerId, content, attachmentsIds }: Request): Promise<Response> {
    const answer = await this.answerRepository.find(answerId);

    if (answer == null) {
      return left(new ResourceNotFoundError());
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const currentAttachments = await this.attachmentRepository
      .findByAnswer(answer.id.toString());
    const attachmentList = new AnswerAttachmentList(currentAttachments);
    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id
      });
    });
    attachmentList.update(answerAttachments);

    answer.attachments = attachmentList
    answer.content = content;
    await this.answerRepository.save(answer);
    return right({
      answer
    });
  }
}
