import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { DatabaseModule } from '../database/database.module';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    PrismaService,
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
  ],
  imports: [DatabaseModule],
})
export class HttpModule {}
