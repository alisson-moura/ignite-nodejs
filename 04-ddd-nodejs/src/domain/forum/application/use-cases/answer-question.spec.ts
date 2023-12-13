import { type Answer } from '../../enterprise/entities/answer';
import { type CreateAnswerRepository } from '../repositories/answers-repository';
import { AnswerQuestionUseCase } from './answer-question';

test('create an answer', async () => {
  const answersRepository: CreateAnswerRepository = {
    async create (answer: Answer) {}
  };
  const answerQuestionUseCase = new AnswerQuestionUseCase(answersRepository);
  const answer = await answerQuestionUseCase.execute({
    questionId: '1',
    instructorId: '1',
    content: 'Nova respostas'
  });

  expect(answer.content).toEqual('Nova respostas');
});
