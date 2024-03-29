import { AnswersRepository } from '../repositories/answers-repository';
import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import { CommentOnAnswerUseCase } from './comment-on-answer';
import { AnswerCommentRepository } from '../repositories/answers-comments-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answer-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let answerRepository: AnswersRepository;
let commentRepository: AnswerCommentRepository;
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
    answerRepository = new InMemoryAnswersRepository(
      new InMemoryAnswerAttachmentsRepository(),
    );
    commentRepository = new InMemoryAnswerCommentsRepository();
    sut = new CommentOnAnswerUseCase(answerRepository, commentRepository);
  });

  it('should be able to comment on answer', async () => {
    const fakeAnswer = makeFakeAnswer();
    const spyOnCreateCommentRepository = vi.spyOn(commentRepository, 'create');
    vi.spyOn(answerRepository, 'findById').mockResolvedValueOnce(fakeAnswer);

    const result = await sut.execute({
      answerId: 'fake_question_id',
      authorId: 'fake_author_id',
      content: 'Comentário teste',
    });

    expect(spyOnCreateCommentRepository).toHaveBeenCalledOnce();
    expect(result.isRight()).toBeTruthy();
  });

  it('should return an erro when answerId is invalid', async () => {
    vi.spyOn(answerRepository, 'findById').mockResolvedValueOnce(null);

    const result = await sut.execute({
      answerId: 'fake_question_id',
      authorId: 'fake_author_id',
      content: 'Comentário teste',
    });

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
