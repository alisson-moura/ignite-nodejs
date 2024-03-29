import { type Either, left, right } from '@/core/either';
import { type DeleteAnswerRepository, type FindAnswerByIdRepository } from '../repositories/answers-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { NotAllowedError } from './errors/not-allowed';
import { DeleteAttachmentByAnswerIdRepository } from '../repositories/answer-attachment-repository';

interface Request {
  answerId: string
  authorId: string
}

type Response = Either<ResourceNotFoundError | NotAllowedError, void>;

export class DeleteAnswerUseCase {
  constructor (
    private readonly answerRepository: DeleteAnswerRepository &
    FindAnswerByIdRepository, 
    private readonly attachmentRepository: DeleteAttachmentByAnswerIdRepository
  ) { }

  public async execute ({ authorId, answerId }: Request): Promise<Response> {
    const answer = await this.answerRepository.find(answerId);

    if (answer == null) {
      return left(new ResourceNotFoundError());
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.attachmentRepository.delete(answer.id.toString());
    await this.answerRepository.delete(answer);
    return right(undefined);
  }
}
