import { BadRequestException, UnauthorizedException, UsePipes } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { AuthStudentUseCase } from '@/domain/forum/application/use-cases/auth-student';
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error.ts';

const authenticateBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .required();

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private authUseCase: AuthStudentUseCase
  ) { }

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const result = await this.authUseCase.execute(body)
    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case WrongCredentialsError:
            throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      access_token: result.value.accessToken
    }
  }
}
