import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { type FindQuestionBySlugRepository } from '../repositories/question-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { Slug } from '../../enterprise/entities/value-objects/slug';

let questionRepository: FindQuestionBySlugRepository;
let sut: GetQuestionBySlugUseCase;

describe('Create Question Use Case', () => {
  beforeEach(() => {
    questionRepository = {
      async find (slug: string) {
        return null;
      }
    };
    sut = new GetQuestionBySlugUseCase(questionRepository);
  });

  it('should be able to get a question by slug', async () => {
    vi.spyOn(questionRepository, 'find').mockResolvedValueOnce(Question.create({
      authorId: new UniqueEntityId('fake_id'),
      content: 'fake content',
      title: 'fake title',
      slug: new Slug('fake_question')
    }));

    const { question } = await sut.execute({ slug: 'fake_question' });

    expect(question.id).toBeInstanceOf(UniqueEntityId);
  });
  it('should throw a error when slug is invalid', async () => {
    await expect(sut.execute({ slug: 'fake_question' }))
      .rejects
      .toThrowError('Question not found');
  });
});
