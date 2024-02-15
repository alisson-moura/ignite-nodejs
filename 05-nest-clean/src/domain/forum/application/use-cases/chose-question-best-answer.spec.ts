import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/question-repository';
import { AnswersRepository } from '../repositories/answers-repository';
import { ChoseQuestionBestAnswer } from './chose-question-best-answer';
import { Answer } from '../../enterprise/entities/answer';
import { NotAllowedError } from './errors/not-allowed';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answer-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository';

let questionRepository: QuestionsRepository;
let answersRepository: AnswersRepository;
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
    answersRepository = new InMemoryAnswersRepository(
      new InMemoryAnswerAttachmentsRepository(),
    );
    questionRepository = new InMemoryQuestionsRepository(
      new InMemoryQuestionAttachmentsRepository(),
    );
    sut = new ChoseQuestionBestAnswer(answersRepository, questionRepository);
  });

  it('should be able to chose the question best answer', async () => {
    vi.spyOn(answersRepository, 'findById').mockResolvedValueOnce(
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
    vi.spyOn(answersRepository, 'findById').mockResolvedValueOnce(
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
    vi.spyOn(answersRepository, 'findById').mockResolvedValueOnce(
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
    vi.spyOn(answersRepository, 'findById').mockResolvedValueOnce(null);
    vi.spyOn(questionRepository, 'findById').mockResolvedValueOnce(null);

    const result = await sut.execute({
      answerId: 'fake_answer_id',
      authorId: 'wrong_author_id',
    });

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
