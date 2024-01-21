import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import { type DeleteAnswerRepository, type FindAnswerByIdRepository } from '../repositories/answers-repository';
import { DeleteAnswerUseCase } from './delete-answer';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { NotAllowedError } from './errors/not-allowed';
import { DeleteAttachmentByAnswerIdRepository } from '../repositories/answer-attachment-repository';

let answerRepository: DeleteAnswerRepository & FindAnswerByIdRepository;
let attachmentRepository: DeleteAttachmentByAnswerIdRepository
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
    attachmentRepository = {
      async delete(AnswerId) {},
    }
    sut = new DeleteAnswerUseCase(answerRepository, attachmentRepository);
  });

  it('should be able to delete a answer', async () => {
    vi.spyOn(answerRepository, 'find')
      .mockResolvedValueOnce(makeFakeAnswer('fake_id'));
    const result = await sut.execute({
      authorId: 'fake_author_id',
      answerId: 'fake_id'
    });

    expect(result.value).toBeUndefined();
  });

  it('should throw a error when answerId is invalid', async () => {
    const result = await sut.execute({ answerId: 'wrong_id', authorId: 'wrong_id' });
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw a error when authorId is invalid', async () => {
    vi.spyOn(answerRepository, 'find')
      .mockResolvedValueOnce(makeFakeAnswer('fake_id'));
    const result = await sut.execute({ answerId: 'fake_id', authorId: 'wrong_id' });
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
