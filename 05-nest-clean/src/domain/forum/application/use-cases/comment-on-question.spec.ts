import { CommentOnQuestionUseCase } from './comment-on-question';
import { QuestionsRepository } from '../repositories/question-repository';
import { QuestionCommentRepository } from '../repositories/question-comment-repository';
import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comment-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository';

let questionRepository: QuestionsRepository;
let commentRepository: QuestionCommentRepository;
let sut: CommentOnQuestionUseCase;

const makeFakeQuestion = (): Question =>
  Question.create(
    {
      authorId: new UniqueEntityId('fake_author_id'),
      content: faker.lorem.text(),
      title: faker.lorem.sentence(),
    },
    new UniqueEntityId(),
  );

describe('Comment on Question', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionsRepository(
      new InMemoryQuestionAttachmentsRepository(),
    );
    commentRepository = new InMemoryQuestionCommentsRepository();
    sut = new CommentOnQuestionUseCase(questionRepository, commentRepository);
  });

  it('should be able to comment on question', async () => {
    const spyOnCreateCommentRepository = vi.spyOn(commentRepository, 'create');
    vi.spyOn(questionRepository, 'findById').mockResolvedValueOnce(
      makeFakeQuestion(),
    );

    const response = await sut.execute({
      questionId: 'fake_question_id',
      authorId: 'fake_author_id',
      content: 'Comentário teste',
    });

    expect(spyOnCreateCommentRepository).toHaveBeenCalledOnce();
    expect(response.isRight()).toBeTruthy();
  });

  it('should not be possible to comment on a non-existent question ', async () => {
    vi.spyOn(questionRepository, 'findById').mockResolvedValueOnce(null);

    const response = await sut.execute({
      questionId: 'fake_question_id',
      authorId: 'fake_author_id',
      content: 'Comentário teste',
    });

    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
