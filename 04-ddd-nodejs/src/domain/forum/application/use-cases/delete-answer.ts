import { type DeleteAnswerRepository, type FindAnswerByIdRepository } from '../repositories/answers-repository';

interface Request {
  answerId: string
  authorId: string
}

export class DeleteAnswerUseCase {
  constructor (
    private readonly answerRepository: DeleteAnswerRepository &
    FindAnswerByIdRepository
  ) { }

  public async execute ({ authorId, answerId }: Request): Promise<void> {
    const answer = await this.answerRepository.find(answerId);

    if (answer == null) {
      throw new Error('Answer not found');
    }

    if (answer.authorId.toString() !== authorId) {
      throw new Error('Not allowed');
    }
  }
}
