import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { type DeleteQuestionRepository, type FindQuestionByIdRepository } from '../repositories/question-repository';
import { DeleteQuestionUseCase } from './delete-question';

let questionRepository: FindQuestionByIdRepository & DeleteQuestionRepository;
let sut: DeleteQuestionUseCase;

const makeFakeQuestion = (id: string): Question => Question.create({
  authorId: new UniqueEntityId('fake_author_id'),
  content: faker.lorem.text(),
  title: faker.lorem.sentence()
}, new UniqueEntityId(id));

describe('Delete Question Use Case', () => {
  beforeEach(() => {
    questionRepository = {
      async find (slug: string) { return null; },
      async delete (question) { }
    };
    sut = new DeleteQuestionUseCase(questionRepository);
  });

  it('should be able to delete a question', async () => {
    vi.spyOn(questionRepository, 'find')
      .mockResolvedValueOnce(makeFakeQuestion('fake_id'));

    await expect(sut.execute({
      authorId: 'fake_author_id',
      questionId: 'fake_id'
    }))
      .resolves.toBeUndefined();
  });

  it('should throw a error when questionId is invalid', async () => {
    await expect(sut.execute({ questionId: 'wrong_id', authorId: 'wrong_id' }))
      .rejects
      .toThrowError('Question not found');
  });
  it('should throw a error when authorId is invalid', async () => {
    vi.spyOn(questionRepository, 'find')
      .mockResolvedValueOnce(makeFakeQuestion('fake_id'));
    await expect(sut.execute({ questionId: 'fake_id', authorId: 'wrong_id' }))
      .rejects
      .toThrowError('Not allowed');
  });
});
