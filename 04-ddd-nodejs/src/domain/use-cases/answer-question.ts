import { Answer } from "../entities/answer"
import { CreateAnswerRepository } from "../repositories/answers-repository"

interface Request {
  instructorId: string
  questionId: string
  content: string
}
export class AnswerQuestionUseCase {
  constructor(
    private answersRepository: CreateAnswerRepository
  ) {}
  public async  execute({instructorId, content, questionId}: Request) {
    const answer = new Answer({
      authorId: instructorId,
      content, 
      questionId
    })

    await this.answersRepository.create(answer)
    return answer
  }
}