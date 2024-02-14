import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import {
  type SaveQuestionRepository,
  type FindQuestionByIdRepository,
} from '../repositories/question-repository';
import { type FindAnswerByIdRepository } from '../repositories/answers-repository';
import { ChoseQuestionBestAnswer } from './chose-question-best-answer';
import { Answer } from '../../enterprise/entities/answer';
import { NotAllowedError } from './errors/not-allowed';
import { ResourceNotFoundError } from './errors/resource-not-found';

let questionRepository: FindQuestionByIdRepository & SaveQuestionRepository;
let answersRepository: FindAnswerByIdRepository;
let sut: ChoseQuestionBestAnswer;

const makeFakeQuestion = (id: string): Question =>
  Question.create(
    {
      authorId: new UniqueEntityId('fake_question_author_id'),
      content: faker.lorem.text(),
      title: faker.lorem.sentence(),
    },
    new UniqueEntityId(id),
  );

const makeFakeAnswer = (answerId: string, questionId: string): Answer =>
  Answer.create(
    {
      authorId: new UniqueEntityId('fake_author_id'),
      content: faker.lorem.sentence(),
      questionId: new UniqueEntityId(questionId),
    },
    new UniqueEntityId(answerId),
  );

describe('Chose Question Best Answer Use Case', () => {
  beforeEach(() => {
    questionRepository = {
      async findById() {
        return null;
      },
      async save() {},
    };
    answersRepository = {
      async find() {
        return null;
      },
    };
    sut = new ChoseQuestionBestAnswer(answersRepository, questionRepository);
  });

  it('should be able to chose the question best answer', async () => {
    vi.spyOn(answersRepository, 'find').mockResolvedValueOnce(
      makeFakeAnswer('fake_answer_id', 'fake_question_id'),
    );
    vi.spyOn(questionRepository, 'findById').mockResolvedValueOnce(
      makeFakeQuestion('fake_question_id'),
    );

    const response = await sut.execute({
      answerId: 'fake_answer_id',
      authorId: 'fake_question_author_id',
    });

    if (response.isRight()) {
      expect(response.value?.question.bestAnswerId?.toString()).toEqual(
        'fake_answer_id',
      );
    }
  });

  it('should not be able to to choose another user question best answer', async () => {
    vi.spyOn(answersRepository, 'find').mockResolvedValueOnce(
      makeFakeAnswer('fake_answer_id', 'fake_question_id'),
    );
    vi.spyOn(questionRepository, 'findById').mockResolvedValueOnce(
      makeFakeQuestion('fake_question_id'),
    );

    const result = await sut.execute({
      answerId: 'fake_answer_id',
      authorId: 'wrong_author_id',
    });

    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be possible to choose a question that does not exist', async () => {
    vi.spyOn(answersRepository, 'find').mockResolvedValueOnce(
      makeFakeAnswer('fake_answer_id', 'fake_question_id'),
    );
    vi.spyOn(questionRepository, 'findById').mockResolvedValueOnce(null);

    const result = await sut.execute({
      answerId: 'fake_answer_id',
      authorId: 'wrong_author_id',
    });

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
  it('should not be possible to choose a answer that does not exist', async () => {
    vi.spyOn(answersRepository, 'find').mockResolvedValueOnce(null);
    vi.spyOn(questionRepository, 'findById').mockResolvedValueOnce(null);

    const result = await sut.execute({
      answerId: 'fake_answer_id',
      authorId: 'wrong_author_id',
    });

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
