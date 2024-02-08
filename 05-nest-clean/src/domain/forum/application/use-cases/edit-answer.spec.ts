import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import {
  type FindAnswerByIdRepository,
  type SaveAnswerRepository,
} from '../repositories/answers-repository';
import { EditAnswerUseCase } from './edit-answer';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { NotAllowedError } from './errors/not-allowed';
import { FindAttachmentByAnswerIdRepository } from '../repositories/answer-attachment-repository';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';

let answerRepository: SaveAnswerRepository & FindAnswerByIdRepository;
let attachmentRepository: FindAttachmentByAnswerIdRepository;
let sut: EditAnswerUseCase;

const makeFakeAnswer = (id: string): Answer =>
  Answer.create(
    {
      authorId: new UniqueEntityId('fake_author_id'),
      content: faker.lorem.text(),
      questionId: new UniqueEntityId('fake_question_id'),
    },
    new UniqueEntityId(id),
  );

describe('Edit Answer Use Case', () => {
  beforeEach(() => {
    answerRepository = {
      async find() {
        return null;
      },
      async save() {},
    };
    attachmentRepository = {
      async findByAnswer() {
        return [];
      },
    };
    sut = new EditAnswerUseCase(answerRepository, attachmentRepository);
  });

  it('should be able to edit a answer', async () => {
    vi.spyOn(answerRepository, 'find').mockResolvedValueOnce(
      makeFakeAnswer('fake_id'),
    );
    const response = await sut.execute({
      authorId: 'fake_author_id',
      answerId: 'fake_id',
      content: 'fake_content',
      attachmentsIds: [],
    });
    expect(response.isRight()).toBeTruthy();
    if (response.isRight()) {
      expect(response.value.answer.updatedAt).toBeTruthy();
      expect(response.value.answer.content).toEqual('fake_content');
    }
  });

  it('should throw a error when answerId is invalid', async () => {
    const result = await sut.execute({
      authorId: 'fake_author_id',
      answerId: 'wrong_id',
      content: 'fake_content',
      attachmentsIds: [],
    });
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw a error when authorId is invalid', async () => {
    vi.spyOn(answerRepository, 'find').mockResolvedValueOnce(
      makeFakeAnswer('fake_id'),
    );
    const result = await sut.execute({
      answerId: 'fake_id',
      authorId: 'wrong_id',
      content: 'fake_content',
      attachmentsIds: [],
    });

    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should be able to edit a answer with attachments', async () => {
    vi.spyOn(answerRepository, 'find').mockResolvedValueOnce(
      makeFakeAnswer('fake_id'),
    );
    vi.spyOn(attachmentRepository, 'findByAnswer').mockResolvedValueOnce([
      AnswerAttachment.create({
        answerId: new UniqueEntityId('fake_id'),
        attachmentId: new UniqueEntityId('1'),
      }),
      AnswerAttachment.create({
        answerId: new UniqueEntityId('fake_id'),
        attachmentId: new UniqueEntityId('2'),
      }),
    ]);
    const response = await sut.execute({
      authorId: 'fake_author_id',
      answerId: 'fake_id',
      content: 'fake_content',
      attachmentsIds: ['1', '2', '3'],
    });

    expect(response.isRight()).toBeTruthy();
    if (response.isRight()) {
      expect(response.value.answer.updatedAt).toBeTruthy();
      expect(response.value.answer.content).toEqual('fake_content');
      expect(response.value.answer.attachments.getItems()).toHaveLength(3);
    }
  });
});
