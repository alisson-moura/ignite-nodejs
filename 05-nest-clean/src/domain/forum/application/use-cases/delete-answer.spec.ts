import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';
import { DeleteAnswerUseCase } from './delete-answer';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { NotAllowedError } from './errors/not-allowed';
import { AnswerAttachmentRepository } from '../repositories/answer-attachment-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answer-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let answerRepository: AnswersRepository;
let attachmentRepository: AnswerAttachmentRepository;
let sut: DeleteAnswerUseCase;

const makeFakeAnswer = (id: string): Answer =>
  Answer.create(
    {
      authorId: new UniqueEntityId('fake_author_id'),
      content: faker.lorem.text(),
      questionId: new UniqueEntityId('fake_question_id'),
    },
    new UniqueEntityId(id),
  );

describe('Delete Answer Use Case', () => {
  beforeEach(() => {
    attachmentRepository = new InMemoryAnswerAttachmentsRepository();
    answerRepository = new InMemoryAnswersRepository(attachmentRepository);
    sut = new DeleteAnswerUseCase(answerRepository, attachmentRepository);
  });

  it('should be able to delete a answer', async () => {
    vi.spyOn(answerRepository, 'findById').mockResolvedValueOnce(
      makeFakeAnswer('fake_id'),
    );
    const result = await sut.execute({
      authorId: 'fake_author_id',
      answerId: 'fake_id',
    });

    expect(result.value).toBeUndefined();
  });

  it('should throw a error when answerId is invalid', async () => {
    const result = await sut.execute({
      answerId: 'wrong_id',
      authorId: 'wrong_id',
    });
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw a error when authorId is invalid', async () => {
    vi.spyOn(answerRepository, 'findById').mockResolvedValueOnce(
      makeFakeAnswer('fake_id'),
    );
    const result = await sut.execute({
      answerId: 'fake_id',
      authorId: 'wrong_id',
    });
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
