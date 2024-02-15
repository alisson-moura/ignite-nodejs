import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentRepository } from '../repositories/answers-comments-repository';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';

let answerCommentsRepository: AnswerCommentRepository;
let sut: FetchAnswerCommentsUseCase;

const makeFakeComment = (): AnswerComment =>
  AnswerComment.create(
    {
      authorId: new UniqueEntityId('fake_author_id'),
      content: faker.lorem.text(),
      answerId: new UniqueEntityId('fake_answer_id'),
    },
    new UniqueEntityId(),
  );

describe('Fetch  Answer Comments Use Case', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository);
  });

  it('Should be able to fetch answers comments', async () => {
    vi.spyOn(
      answerCommentsRepository,
      'findManyByAnswerId',
    ).mockResolvedValueOnce([makeFakeComment(), makeFakeComment()]);

    const result = await sut.execute({
      answerId: 'fake_answer_id',
      page: 1,
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.comments.length).toEqual(2);
    }
  });
});
