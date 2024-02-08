import { type FindAnswerByIdRepository } from '../repositories/answers-repository';
import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import { CommentOnAnswerUseCase } from './comment-on-answer';
import { type CreateAnswerCommentRepository } from '../repositories/answers-comments-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';

let answerRepository: FindAnswerByIdRepository;
let commentRepository: CreateAnswerCommentRepository;
let sut: CommentOnAnswerUseCase;

const makeFakeAnswer = (): Answer =>
  Answer.create(
    {
      authorId: new UniqueEntityId('fake_author_id'),
      content: faker.lorem.text(),
      questionId: new UniqueEntityId('fake_question_id'),
    },
    new UniqueEntityId(),
  );

describe('Comment on Answer', () => {
  beforeEach(() => {
    answerRepository = {
      async find() {
        return null;
      },
    };
    commentRepository = {
      async create() {},
    };
    sut = new CommentOnAnswerUseCase(answerRepository, commentRepository);
  });

  it('should be able to comment on answer', async () => {
    const fakeAnswer = makeFakeAnswer();
    const spyOnCreateCommentRepository = vi.spyOn(commentRepository, 'create');
    vi.spyOn(answerRepository, 'find').mockResolvedValueOnce(fakeAnswer);

    const result = await sut.execute({
      answerId: 'fake_question_id',
      authorId: 'fake_author_id',
      content: 'Comentário teste',
    });

    expect(spyOnCreateCommentRepository).toHaveBeenCalledOnce();
    expect(result.isRight()).toBeTruthy();
  });

  it('should return an erro when answerId is invalid', async () => {
    vi.spyOn(answerRepository, 'find').mockResolvedValueOnce(null);

    const result = await sut.execute({
      answerId: 'fake_question_id',
      authorId: 'fake_author_id',
      content: 'Comentário teste',
    });

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
