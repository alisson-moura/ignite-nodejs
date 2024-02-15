import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionsRepository } from '../repositories/question-repository';
import { CreateQuestionUseCase } from './create-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository';

let questionRepository: QuestionsRepository;
let sut: CreateQuestionUseCase;

describe('Create Question Use Case', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionsRepository(
      new InMemoryQuestionAttachmentsRepository(),
    );
    sut = new CreateQuestionUseCase(questionRepository);
  });

  it('should be able to create a question', async () => {
    const response = await sut.execute({
      authorId: '1',
      title: 'Fake title',
      content: 'fake description.',
      attachmentsIds: [],
    });

    expect(response.isRight()).toBeTruthy();
    if (response.isRight()) {
      expect(response.value.question.id).toBeInstanceOf(UniqueEntityId);
    }
  });

  it('should be able to create a question with attachments', async () => {
    const response = await sut.execute({
      authorId: '1',
      title: 'Fake title',
      content: 'fake description.',
      attachmentsIds: ['1', '2'],
    });

    expect(response.isRight()).toBeTruthy();
    if (response.isRight()) {
      expect(response.value.question.attachments.getItems()).toHaveLength(2);
    }
  });
});
