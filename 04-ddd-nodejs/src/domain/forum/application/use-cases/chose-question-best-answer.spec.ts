import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { type SaveQuestionRepository, type FindQuestionByIdRepository } from '../repositories/question-repository';
import { type FindAnswerByIdRepository } from '../repositories/answers-repository';
import { ChoseQuestionBestAnswer } from './chose-question-best-answer';
import { Answer } from '../../enterprise/entities/answer';

let questionRepository: FindQuestionByIdRepository & SaveQuestionRepository;
let answersRepository: FindAnswerByIdRepository;
let sut: ChoseQuestionBestAnswer;

const makeFakeQuestion = (id: string): Question => Question.create({
  authorId: new UniqueEntityId('fake_question_author_id'),
  content: faker.lorem.text(),
  title: faker.lorem.sentence()
}, new UniqueEntityId(id));

const makeFakeAnswer = (answerId: string, questionId: string): Answer => Answer.create({
  authorId: new UniqueEntityId('fake_author_id'),
  content: faker.lorem.sentence(),
  questionId: new UniqueEntityId(questionId)
}, new UniqueEntityId(answerId));

describe('Chose Question Best Answer Use Case', () => {
  beforeEach(() => {
    questionRepository = {
      async find (id: string) { return null; },
      async save (question) { }
    };
    answersRepository = {
      async find (id) {
        return null;
      }
    };
    sut = new ChoseQuestionBestAnswer(answersRepository, questionRepository);
  });

  it('should be able to chose the question best answer', async () => {
    vi.spyOn(answersRepository, 'find')
      .mockResolvedValueOnce(makeFakeAnswer('fake_answer_id', 'fake_question_id'));
    vi.spyOn(questionRepository, 'find')
      .mockResolvedValueOnce(makeFakeQuestion('fake_question_id'));

    const response = await sut.execute({
      answerId: 'fake_answer_id',
      authorId: 'fake_question_author_id'
    });

    expect(response.question.bestAnswerId?.toString()).toEqual('fake_answer_id');
  });

  it('should throw a error when authorId is invalid', async () => {
    vi.spyOn(answersRepository, 'find')
      .mockResolvedValueOnce(makeFakeAnswer('fake_answer_id', 'fake_question_id'));
    vi.spyOn(questionRepository, 'find')
      .mockResolvedValueOnce(makeFakeQuestion('fake_question_id'));

    await expect(sut.execute({
      answerId: 'fake_answer_id',
      authorId: 'wrong_author_id'
    }))
      .rejects
      .toThrowError('Not allowed');
  });
});
