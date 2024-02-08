import { CommentOnQuestionUseCase } from './comment-on-question';
import { type FindQuestionByIdRepository } from '../repositories/question-repository';
import { type CreateQuestionCommentRepository } from '../repositories/question-comment-repository';
import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { ResourceNotFoundError } from './errors/resource-not-found';

let questionRepository: FindQuestionByIdRepository;
let commentRepository: CreateQuestionCommentRepository;
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
    questionRepository = {
      async find() {
        return null;
      },
    };
    commentRepository = {
      async create() {},
    };
    sut = new CommentOnQuestionUseCase(questionRepository, commentRepository);
  });

  it('should be able to comment on question', async () => {
    const spyOnCreateCommentRepository = vi.spyOn(commentRepository, 'create');
    vi.spyOn(questionRepository, 'find').mockResolvedValueOnce(
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
    vi.spyOn(questionRepository, 'find').mockResolvedValueOnce(null);

    const response = await sut.execute({
      questionId: 'fake_question_id',
      authorId: 'fake_author_id',
      content: 'Comentário teste',
    });

    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
