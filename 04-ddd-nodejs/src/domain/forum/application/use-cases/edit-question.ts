import { type SaveQuestionRepository, type FindQuestionByIdRepository } from '../repositories/question-repository';

interface Request {
  questionId: string
  authorId: string
  title: string
  content: string
}

export class EditQuestionUseCase {
  constructor (
    private readonly questionRepository: FindQuestionByIdRepository
    & SaveQuestionRepository
  ) { }

  public async execute ({ authorId, questionId, title, content }: Request): Promise<void> {
    const question = await this.questionRepository.find(questionId);

    if (question == null) {
      throw new Error('Question not found');
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('Not allowed');
    }

    question.title = title;
    question.content = content;
    await this.questionRepository.save(question);
  }
}
