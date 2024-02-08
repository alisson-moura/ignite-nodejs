import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';

export interface AnswerAttachmentRepository extends
  FindAttachmentByAnswerIdRepository,
  DeleteAttachmentByAnswerIdRepository { }

export interface FindAttachmentByAnswerIdRepository {
  findByAnswer: (answerId: string) => Promise<AnswerAttachment[]>
}

export interface DeleteAttachmentByAnswerIdRepository {
  delete: (AnswerId: string) => Promise<void>
}
