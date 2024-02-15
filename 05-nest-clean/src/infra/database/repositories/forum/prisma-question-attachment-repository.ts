import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  async findByQuestion(questionId: string): Promise<QuestionAttachment[]> {
    return [];
  }
  async delete(questionId: string): Promise<void> {}
}
