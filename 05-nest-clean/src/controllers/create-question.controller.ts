import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserPayload } from '../auth/jwt.strategy';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { PrismaService } from '../prisma/prisma.service';
import { z } from 'zod';

const createQuestionBodySchema = z
  .object({
    title: z.string(),
    content: z.string(),
  })
  .required();

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createQuestionBodySchema))
  async handle(
    @Body() body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body;
    const authorId = user.sub;
    const slug = this.convertToSlug(title);

    await this.prisma.question.create({
      data: {
        content,
        title,
        slug,
        authorId,
      },
    });
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
}
