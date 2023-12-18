import { type FindAnswerByIdRepository } from '../repositories/answers-repository';
import { type FindQuestionByIdRepository, type SaveQuestionRepository } from '../repositories/question-repository';
import { type Question } from '../../enterprise/entities/question';

interface Request {
  answerId: string
  authorId: string
}

interface Response {
  question: Question
}

export class ChoseQuestionBestAnswer {
  constructor (
    private readonly answersRepository: FindAnswerByIdRepository,
    private readonly questionRepository: FindQuestionByIdRepository &
    SaveQuestionRepository
  ) { }

  public async execute ({ answerId, authorId }: Request): Promise<Response> {
    const answer = await this.answersRepository.find(answerId);
    if (answer == null) {
      throw new Error('Answer not found');
    }

    const question = await this.questionRepository
      .find(answer.questionId.toString());
    if (question == null) {
      throw new Error('Question not found');
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('Not allowed');
    }

    question.bestAnswerId = answer.id;
    await this.questionRepository.save(question);

    return { question };
  }
}
