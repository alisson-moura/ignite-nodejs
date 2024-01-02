import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { type FindManyRecentRepository } from '../repositories/question-repository';
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions';
import { type PaginationParams } from '@/core/repositories/pagination';

let questionsRepository: FindManyRecentRepository;
let sut: FetchRecentQuestionsUseCase;

const makeFakeQuestion = (): Question => Question.create({
  authorId: new UniqueEntityId(),
  content: faker.lorem.text(),
  title: faker.lorem.sentence()
});

describe('Fetch Recent Questions Use Case', () => {
  beforeEach(() => {
    questionsRepository = {
      async find ({ page }: PaginationParams) {
        return [];
      }
    };
    sut = new FetchRecentQuestionsUseCase(questionsRepository);
  });

  it('Should be able to get a recent questions', async () => {
    vi.spyOn(questionsRepository, 'find')
      .mockResolvedValueOnce([makeFakeQuestion(), makeFakeQuestion()]);

    const result = await sut.execute({ page: 1 });

    expect(result.value?.questions.length).toEqual(2);
  });
});
