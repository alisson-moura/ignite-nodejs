import { type Either, left, right } from '@/core/either';
import { QuestionsRepository } from '../repositories/question-repository';
import { NotAllowedError } from './errors/not-allowed';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { QuestionAttachmentRepository } from '../repositories/question-attachment-repository';

interface Request {
  questionId: string;
  authorId: string;
}

type Response = Either<ResourceNotFoundError | NotAllowedError, void>;

export class DeleteQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionsRepository,
    private readonly attachmentRepository: QuestionAttachmentRepository,
  ) {}

  public async execute({ authorId, questionId }: Request): Promise<Response> {
    const question = await this.questionRepository.findById(questionId);

    if (question == null) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.attachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
    await this.questionRepository.delete(question);

    return right(undefined);
  }
}
