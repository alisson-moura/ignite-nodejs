import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { type FindManyRecentRepository } from '../repositories/question-repository';
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions';

let questionsRepository: FindManyRecentRepository;
let sut: FetchRecentQuestionsUseCase;

const makeFakeQuestion = (): Question =>
  Question.create({
    authorId: new UniqueEntityId(),
    content: faker.lorem.text(),
    title: faker.lorem.sentence(),
  });

describe('Fetch Recent Questions Use Case', () => {
  beforeEach(() => {
    questionsRepository = {
      async findMany() {
        return [];
      },
    };
    sut = new FetchRecentQuestionsUseCase(questionsRepository);
  });

  it('Should be able to get a recent questions', async () => {
    vi.spyOn(questionsRepository, 'findMany').mockResolvedValueOnce([
      makeFakeQuestion(),
      makeFakeQuestion(),
    ]);

    const result = await sut.execute({ page: 1 });

    expect(result.value?.questions.length).toEqual(2);
  });
});
