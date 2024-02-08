import { Controller, Get, Query, UseGuards, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { PrismaService } from '../prisma/prisma.service';
import { z } from 'zod';

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
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(paginationQuerySchema))
  async handle(@Query() query: PaginationQuerySchema) {
    const { page } = query;
    const perPage = 20;

    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return {
      questions,
    };
  }
}
