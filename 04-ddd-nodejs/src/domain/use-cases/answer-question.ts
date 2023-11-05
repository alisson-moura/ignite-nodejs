import { UniqueEntityId } from "../../core/entities/unique-entity-id"
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
    const answer = Answer.create({
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
      content
    })

    await this.answersRepository.create(answer)
    return answer
  }
}