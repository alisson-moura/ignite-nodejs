import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import { type DeleteAnswerRepository, type FindAnswerByIdRepository } from '../repositories/answers-repository';
import { DeleteAnswerUseCase } from './delete-answer';

let answerRepository: DeleteAnswerRepository & FindAnswerByIdRepository;
let sut: DeleteAnswerUseCase;

const makeFakeAnswer = (id: string): Answer => Answer.create({
  authorId: new UniqueEntityId('fake_author_id'),
  content: faker.lorem.text(),
  questionId: new UniqueEntityId('fake_question_id')
}, new UniqueEntityId(id));

describe('Delete Answer Use Case', () => {
  beforeEach(() => {
    answerRepository = {
      async find (id: string) { return null; },
      async delete (answer) { }
    };
    sut = new DeleteAnswerUseCase(answerRepository);
  });

  it('should be able to delete a answer', async () => {
    vi.spyOn(answerRepository, 'find')
      .mockResolvedValueOnce(makeFakeAnswer('fake_id'));

    await expect(sut.execute({
      authorId: 'fake_author_id',
      answerId: 'fake_id'
    }))
      .resolves.toBeUndefined();
  });

  it('should throw a error when answerId is invalid', async () => {
    await expect(sut.execute({ answerId: 'wrong_id', authorId: 'wrong_id' }))
      .rejects
      .toThrowError('Answer not found');
  });

  it('should throw a error when authorId is invalid', async () => {
    vi.spyOn(answerRepository, 'find')
      .mockResolvedValueOnce(makeFakeAnswer('fake_id'));
    await expect(sut.execute({ answerId: 'fake_id', authorId: 'wrong_id' }))
      .rejects
      .toThrowError('Not allowed');
  });
});
