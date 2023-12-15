import { type DeleteQuestionRepository, type FindQuestionByIdRepository } from '../repositories/question-repository';

interface Request {
  questionId: string
  authorId: string
}

export class DeleteQuestionUseCase {
  constructor (
    private readonly questionRepository: FindQuestionByIdRepository
    & DeleteQuestionRepository
  ) { }

  public async execute ({ authorId, questionId }: Request): Promise<void> {
    const question = await this.questionRepository.find(questionId);

    if (question == null) {
      throw new Error('Question not found');
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('Not allowed');
    }

    await this.questionRepository.delete(question);
  }
}
