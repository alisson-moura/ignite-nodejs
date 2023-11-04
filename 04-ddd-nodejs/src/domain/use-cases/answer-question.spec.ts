import {expect, test} from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'
import { CreateAnswerRepository } from '../repositories/answers-repository'
import { Answer } from '../entities/answer'

test('create an answer', async () => {
  const answersRepository: CreateAnswerRepository = {
    async create(answer: Answer) {}
  }
  const answerQuestionUseCase = new AnswerQuestionUseCase(answersRepository)
  const answer = await answerQuestionUseCase.execute({
    questionId: '1',
    instructorId: '1',
    content: 'Nova respostas'
  })

  expect(answer.content).toEqual('Nova respostas')
})