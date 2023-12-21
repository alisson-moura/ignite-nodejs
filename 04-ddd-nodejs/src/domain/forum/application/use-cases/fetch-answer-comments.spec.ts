import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { type PaginationParams } from '@/core/repositories/pagination';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { type FindManyByAnswerIdRepository } from '../repositories/answers-comments-repository';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';

let answerCommentsRepository: FindManyByAnswerIdRepository;
let sut: FetchAnswerCommentsUseCase;

const makeFakeComment = (): AnswerComment => AnswerComment.create({
  authorId: new UniqueEntityId('fake_author_id'),
  content: faker.lorem.text(),
  answerId: new UniqueEntityId('fake_answer_id')
}, new UniqueEntityId());

describe('Fetch  Answer Comments Use Case', () => {
  beforeEach(() => {
    answerCommentsRepository = {
      async findMany (answerId: string, { page }: PaginationParams) {
        return [];
      }
    };
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository);
  });

  it('Should be able to fetch answers comments', async () => {
    vi.spyOn(answerCommentsRepository, 'findMany')
      .mockResolvedValueOnce([makeFakeComment(), makeFakeComment()]);

    const { comments } = await sut.execute({
      answerId: 'fake_answer_id', page: 1
    });

    expect(comments.length).toEqual(2);
  });
});
