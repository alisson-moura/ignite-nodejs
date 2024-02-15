import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/question-repository';
import { DeleteQuestionUseCase } from './delete-question';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { NotAllowedError } from './errors/not-allowed';
import { QuestionAttachmentRepository } from '../repositories/question-attachment-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository';

let questionRepository: QuestionsRepository;
let attachmentRepository: QuestionAttachmentRepository;
let sut: DeleteQuestionUseCase;

const makeFakeQuestion = (id: string): Question =>
  Question.create(
    {
      authorId: new UniqueEntityId('fake_author_id'),
      content: faker.lorem.text(),
      title: faker.lorem.sentence(),
    },
    new UniqueEntityId(id),
  );

describe('Delete Question Use Case', () => {
  beforeEach(() => {
    attachmentRepository = new InMemoryQuestionAttachmentsRepository();
    questionRepository = new InMemoryQuestionsRepository(attachmentRepository);
    sut = new DeleteQuestionUseCase(questionRepository, attachmentRepository);
  });

  it('should be able to delete a question', async () => {
    vi.spyOn(questionRepository, 'findById').mockResolvedValueOnce(
      makeFakeQuestion('fake_id'),
    );
    const result = await sut.execute({
      authorId: 'fake_author_id',
      questionId: 'fake_id',
    });

    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a error when questionId is invalid', async () => {
    const response = await sut.execute({
      questionId: 'wrong_id',
      authorId: 'wrong_id',
    });
    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });
  it('should throw a error when authorId is invalid', async () => {
    vi.spyOn(questionRepository, 'findById').mockResolvedValueOnce(
      makeFakeQuestion('fake_id'),
    );
    const response = await sut.execute({
      questionId: 'fake_id',
      authorId: 'wrong_id',
    });
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
