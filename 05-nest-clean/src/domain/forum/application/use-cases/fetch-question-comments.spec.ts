import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments';
import { type FindManyByQuestionIdRepository } from '../repositories/question-comment-repository';
import { QuestionComment } from '../../enterprise/entities/question-comment';

let questionCommentsRepository: FindManyByQuestionIdRepository;
let sut: FetchQuestionCommentsUseCase;

const makeFakeComment = (): QuestionComment =>
  QuestionComment.create(
    {
      authorId: new UniqueEntityId('fake_author_id'),
      content: faker.lorem.text(),
      questionId: new UniqueEntityId('fake_question_id'),
    },
    new UniqueEntityId(),
  );

describe('Fetch  Question Comments Use Case', () => {
  beforeEach(() => {
    questionCommentsRepository = {
      async findMany() {
        return [];
      },
    };
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository);
  });

  it('Should be able to fetch question comments', async () => {
    vi.spyOn(questionCommentsRepository, 'findMany').mockResolvedValueOnce([
      makeFakeComment(),
      makeFakeComment(),
    ]);

    const result = await sut.execute({
      questionId: 'fake_question_id',
      page: 1,
    });

    expect(result.isRight());
    if (result.isRight()) {
      expect(result.value.comments.length).toEqual(2);
    }
  });
});
