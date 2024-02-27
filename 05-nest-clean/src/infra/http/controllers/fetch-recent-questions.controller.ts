import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { QuestionPresenter } from '../presenters/question-presenter';

const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
});

type PaginationQuerySchema = z.infer<typeof paginationQuerySchema>;

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(
    private fetchRecentQuestionUseCase: FetchRecentQuestionsUseCase,
  ) {}

  @Get()
  @UsePipes(new ZodValidationPipe(paginationQuerySchema))
  async handle(@Query() query: PaginationQuerySchema) {
    const { page } = query;
    const perPage = 20;

    const result = await this.fetchRecentQuestionUseCase.execute({
      page,
    });

    if (result.isLeft()) {
      throw new Error();
    }
    const { questions } = result.value;

    return {
      questions: questions.map(QuestionPresenter.toHtpp),
    };
  }
}
