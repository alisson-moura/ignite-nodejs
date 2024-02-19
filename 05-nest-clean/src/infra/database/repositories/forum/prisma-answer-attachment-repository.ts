import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswerAttachmentRepository
  implements AnswerAttachmentRepository
{
  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    return [];
  }
  async deleteManyByAnswerId(AnswerId: string): Promise<void> {}
}
