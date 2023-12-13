import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { type Answer } from '../../enterprise/entities/answer';
import { type CreateAnswerRepository } from '../repositories/answers-repository';
import { AnswerQuestionUseCase } from './answer-question';

let sut: AnswerQuestionUseCase;
let answersRepository: CreateAnswerRepository;

describe('Answer Question Use Case', () => {
  beforeEach(() => {
    answersRepository = {
      async create (answer: Answer) {}
    };
    sut = new AnswerQuestionUseCase(answersRepository);
  });

  it('should be able to answer an question', async () => {
    const { answer } = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'Nova respostas'
    });

    expect(answer.id).toBeInstanceOf(UniqueEntityId);
    expect(answer.content).toEqual('Nova respostas');
  });
});
