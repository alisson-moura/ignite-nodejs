import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerAttachmentRepository } from './repositories/forum/prisma-answer-attachment-repository';
import { PrismaQuestionCommentRepository } from './repositories/forum/prisma-question-comment-repository';
import { PrismaAnswerCommentRepository } from './repositories/forum/prisma-answers-comments-repository';
import { PrismaAnswersRepository } from './repositories/forum/prisma-answers-repository';
import { PrismaQuestionAttachmentRepository } from './repositories/forum/prisma-question-attachment-repository';
import { PrismaQuestionRepository } from './repositories/forum/prisma-question-repository';

@Module({
  providers: [
    PrismaService,
    PrismaAnswerAttachmentRepository,
    PrismaAnswerCommentRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentRepository,
    PrismaQuestionCommentRepository,
    PrismaQuestionRepository,
  ],
  exports: [
    PrismaService,
    PrismaAnswerAttachmentRepository,
    PrismaAnswerCommentRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentRepository,
    PrismaQuestionCommentRepository,
    PrismaQuestionRepository,
  ],
})
export class HttpModule {}
