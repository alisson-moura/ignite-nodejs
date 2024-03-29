import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/question-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository';

let questionRepository: QuestionsRepository;
let sut: GetQuestionBySlugUseCase;

const makeFakeQuestion = (slug: Slug): Question =>
  Question.create({
    authorId: new UniqueEntityId(),
    content: faker.lorem.text(),
    title: faker.lorem.sentence(),
    slug,
  });

describe('Create Question Use Case', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionsRepository(
      new InMemoryQuestionAttachmentsRepository(),
    );
    sut = new GetQuestionBySlugUseCase(questionRepository);
  });

  it('should be able to get a question by slug', async () => {
    vi.spyOn(questionRepository, 'findBySlug').mockResolvedValueOnce(
      makeFakeQuestion(new Slug('fake_question')),
    );

    const result = await sut.execute({ slug: 'fake_question' });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.question.id).toBeInstanceOf(UniqueEntityId);
    }
  });

  it('should throw a error when slug is invalid', async () => {
    const result = await sut.execute({ slug: 'fake_question' });
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
