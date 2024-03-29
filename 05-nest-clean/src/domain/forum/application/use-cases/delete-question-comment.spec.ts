import { QuestionCommentRepository } from '../repositories/question-comment-repository';
import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comment-repository';

let commentRepository: QuestionCommentRepository;
let sut: DeleteQuestionCommentUseCase;

const makeFakeComment = (): QuestionComment =>
  QuestionComment.create(
    {
      authorId: new UniqueEntityId('fake_author_id'),
      content: faker.lorem.text(),
      questionId: new UniqueEntityId('fake_question_id'),
    },
    new UniqueEntityId(),
  );

describe('Delete Question Comment Use Case', () => {
  beforeEach(() => {
    commentRepository = new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(commentRepository);
  });

  it('should be able to delete question comment', async () => {
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
