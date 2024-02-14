import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import {
  type SaveQuestionRepository,
  type FindQuestionByIdRepository,
} from '../repositories/question-repository';
import { EditQuestionUseCase } from './edit-question';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { NotAllowedError } from './errors/not-allowed';
import { type FindAttachmentByQuestionIdRepository } from '../repositories/question-attachment-repository';

let questionRepository: FindQuestionByIdRepository & SaveQuestionRepository;
let attachmentRepository: FindAttachmentByQuestionIdRepository;
let sut: EditQuestionUseCase;

const makeFakeQuestion = (id: string): Question =>
  Question.create(
    {
      authorId: new UniqueEntityId('fake_author_id'),
      content: faker.lorem.text(),
      title: faker.lorem.sentence(),
    },
    new UniqueEntityId(id),
  );

describe('Edit Question Use Case', () => {
  beforeEach(() => {
    questionRepository = {
      async findById() {
        return null;
      },
      async save() {},
    };

    attachmentRepository = {
      async findByQuestion() {
        return [];
      },
    };
    sut = new EditQuestionUseCase(questionRepository, attachmentRepository);
  });

  it('should be able to edit a question', async () => {
    vi.spyOn(questionRepository, 'findById').mockResolvedValueOnce(
      makeFakeQuestion('fake_id'),
    );
    const result = await sut.execute({
      authorId: 'fake_author_id',
      questionId: 'fake_id',
      content: 'fake_content',
      title: 'fake_title',
      attachmentsIds: [],
    });
    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a error when questionId is invalid', async () => {
    const result = await sut.execute({
      questionId: 'wrong_id',
      authorId: 'wrong_id',
      content: 'fake_content',
      title: 'fake_title',
      attachmentsIds: [],
    });

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw a error when authorId is invalid', async () => {
    vi.spyOn(questionRepository, 'findById').mockResolvedValueOnce(
      makeFakeQuestion('fake_id'),
    );
    const result = await sut.execute({
      questionId: 'fake_id',
      authorId: 'wrong_id',
      content: 'fake_content',
      title: 'fake_title',
      attachmentsIds: [],
    });
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
