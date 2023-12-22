import { type Either, left, right } from '@/core/either';
import { type SaveQuestionRepository, type FindQuestionByIdRepository } from '../repositories/question-repository';
import { NotAllowedError } from './errors/not-allowed';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface Request {
  questionId: string
  authorId: string
  title: string
  content: string
}

type Response = Either<ResourceNotFoundError | NotAllowedError, void>;

export class EditQuestionUseCase {
  constructor (
    private readonly questionRepository: FindQuestionByIdRepository
    & SaveQuestionRepository
  ) { }

  public async execute ({ authorId, questionId, title, content }: Request): Promise<Response> {
    const question = await this.questionRepository.find(questionId);

    if (question == null) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    question.title = title;
    question.content = content;
    await this.questionRepository.save(question);
    return right(undefined);
  }
}
