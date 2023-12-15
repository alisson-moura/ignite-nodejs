import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import { type FindAnswerByIdRepository, type SaveAnswerRepository } from '../repositories/answers-repository';
import { EditAnswerUseCase } from './edit-answer';

let answerRepository: SaveAnswerRepository & FindAnswerByIdRepository;
let sut: EditAnswerUseCase;

const makeFakeAnswer = (id: string): Answer => Answer.create({
  authorId: new UniqueEntityId('fake_author_id'),
  content: faker.lorem.text(),
  questionId: new UniqueEntityId('fake_question_id')
}, new UniqueEntityId(id));

describe('Edit Answer Use Case', () => {
  beforeEach(() => {
    answerRepository = {
      async find (id: string) { return null; },
      async save (answer: Answer) { }
    };
    sut = new EditAnswerUseCase(answerRepository);
  });

  it('should be able to edit a answer', async () => {
    vi.spyOn(answerRepository, 'find')
      .mockResolvedValueOnce(makeFakeAnswer('fake_id'));
    const response = await sut.execute({
      authorId: 'fake_author_id',
      answerId: 'fake_id',
      content: 'fake_content'
    });

    expect(response.answer.updatedAt).toBeTruthy();
    expect(response.answer.content).toEqual('fake_content');
  });

  it('should throw a error when answerId is invalid', async () => {
    await expect(sut.execute({
      authorId: 'fake_author_id',
      answerId: 'wrong_id',
      content: 'fake_content'
    }))
      .rejects
      .toThrowError('Answer not found');
  });

  it('should throw a error when authorId is invalid', async () => {
    vi.spyOn(answerRepository, 'find')
      .mockResolvedValueOnce(makeFakeAnswer('fake_id'));
    await expect(sut.execute({
      answerId: 'fake_id',
      authorId: 'wrong_id',
      content: 'fake_content'
    }))
      .rejects
      .toThrowError('Not allowed');
  });
});
