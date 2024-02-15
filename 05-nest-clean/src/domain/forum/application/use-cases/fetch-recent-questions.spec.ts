import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/question-repository';
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository';

let questionsRepository: QuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

const makeFakeQuestion = (): Question =>
  Question.create({
    authorId: new UniqueEntityId(),
    content: faker.lorem.text(),
    title: faker.lorem.sentence(),
  });

describe('Fetch Recent Questions Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository(
      new InMemoryQuestionAttachmentsRepository(),
    );
    sut = new FetchRecentQuestionsUseCase(questionsRepository);
  });

  it('Should be able to get a recent questions', async () => {
    vi.spyOn(questionsRepository, 'findManyRecent').mockResolvedValueOnce([
      makeFakeQuestion(),
      makeFakeQuestion(),
    ]);

    const result = await sut.execute({ page: 1 });

    expect(result.value?.questions.length).toEqual(2);
  });
});
