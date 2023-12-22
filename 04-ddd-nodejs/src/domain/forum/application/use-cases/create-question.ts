import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { type CreateQuestionRepository } from '../repositories/question-repository';
import { right, type Either } from '@/core/either';

interface Request {
  authorId: string
  content: string
  title: string
}
type Response = Either<null, {
  question: Question
}>;

export class CreateQuestionUseCase {
  constructor (
    private readonly questionRepository: CreateQuestionRepository
  ) { }

  public async execute ({ authorId, content, title }: Request): Promise<Response> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content
    });

    await this.questionRepository.create(question);
    return right({ question });
  }
}
