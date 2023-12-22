import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { type Question } from '../../enterprise/entities/question';
import { type CreateQuestionRepository } from '../repositories/question-repository';
import { CreateQuestionUseCase } from './create-question';

let questionRepository: CreateQuestionRepository;
let sut: CreateQuestionUseCase;

describe('Create Question Use Case', () => {
  beforeEach(() => {
    questionRepository = {
      async create (question: Question) {}
    };
    sut = new CreateQuestionUseCase(questionRepository);
  });

  it('should be able to create a question', async () => {
    const response = await sut.execute({
      authorId: '1',
      title: 'Fake title',
      content: 'fake description.'
    });

    expect(response.isRight()).toBeTruthy();
    if (response.isRight()) {
      expect(response.value.question.id).toBeInstanceOf(UniqueEntityId);
    }
  });
});
