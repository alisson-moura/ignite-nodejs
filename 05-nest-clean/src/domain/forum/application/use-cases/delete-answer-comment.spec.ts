import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentRepository } from '../repositories/answers-comments-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';

let commentRepository: AnswerCommentRepository;
let sut: DeleteAnswerCommentUseCase;

const makeFakeComment = (): AnswerComment =>
  AnswerComment.create(
    {
      authorId: new UniqueEntityId('fake_author_id'),
      content: faker.lorem.text(),
      answerId: new UniqueEntityId('fake_answer_id'),
    },
    new UniqueEntityId(),
  );

describe('Delete Answer Comment Use Case', () => {
  beforeEach(() => {
    commentRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(commentRepository);
  });

  it('should be able to delete answer comment', async () => {
    const fakeComment = makeFakeComment();
    const spyOnDeleteCommentRepository = vi.spyOn(commentRepository, 'delete');
    vi.spyOn(commentRepository, 'findById').mockResolvedValueOnce(fakeComment);

    await sut.execute({
      commentId: 'fake_comment_id',
      authorId: 'fake_author_id',
    });

    expect(spyOnDeleteCommentRepository).toHaveBeenCalledWith(fakeComment);
  });
});
