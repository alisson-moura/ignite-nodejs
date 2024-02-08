import { type QuestionAttachment } from '../../enterprise/entities/question-attachment';

export interface QuestionAttachmentRepository
  extends FindAttachmentByQuestionIdRepository {}

export interface FindAttachmentByQuestionIdRepository {
  findByQuestion: (questionId: string) => Promise<QuestionAttachment[]>;
}

export interface DeleteAttachmentByQuestionIdRepository {
  delete: (questionId: string) => Promise<void>;
}
