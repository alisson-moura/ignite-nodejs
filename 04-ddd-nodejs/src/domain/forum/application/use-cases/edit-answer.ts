import { type Answer } from '../../enterprise/entities/answer';
import { type FindAnswerByIdRepository, type SaveAnswerRepository } from '../repositories/answers-repository';

interface Request {
  answerId: string
  authorId: string
  content: string
}

interface Response {
  answer: Answer
}

export class EditAnswerUseCase {
  constructor (
    private readonly AnswerRepository: FindAnswerByIdRepository
    & SaveAnswerRepository
  ) { }

  public async execute ({ authorId, answerId, content }: Request): Promise<Response> {
    const answer = await this.AnswerRepository.find(answerId);

    if (answer == null) {
      throw new Error('Answer not found');
    }

    if (answer.authorId.toString() !== authorId) {
      throw new Error('Not allowed');
    }

    answer.content = content;
    await this.AnswerRepository.save(answer);
    return {
      answer
    };
  }
}
