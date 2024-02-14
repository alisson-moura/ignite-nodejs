import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { type CreateAnswerRepository } from '../repositories/answers-repository';
import { AnswerQuestionUseCase } from './answer-question';
import { type FindQuestionByIdRepository } from '../repositories/question-repository';
import { faker } from '@faker-js/faker';
import { Question } from '../../enterprise/entities/question';
import { ResourceNotFoundError } from './errors/resource-not-found';

let sut: AnswerQuestionUseCase;
let answersRepository: CreateAnswerRepository;
let questionRepository: FindQuestionByIdRepository;

const makeFakeQuestion = (id: string): Question =>
  Question.create(
    {
      authorId: new UniqueEntityId('fake_question_author_id'),
      content: faker.lorem.text(),
      title: faker.lorem.sentence(),
    },
    new UniqueEntityId(id),
  );

describe('Answer Question Use Case', () => {
  beforeEach(() => {
    answersRepository = {
      async create() {},
    };
    questionRepository = {
      async findById() {
        return null;
      },
    };
    sut = new AnswerQuestionUseCase(answersRepository, questionRepository);
  });

  it('should be able to answer an question', async () => {
    vi.spyOn(questionRepository, 'findById').mockResolvedValueOnce(
      makeFakeQuestion('fake_question_id'),
    );

    const result = await sut.execute({
      questionId: 'fake_question_id',
      instructorId: '1',
      content: 'Nova respostas',
      attachmentsIds: [],
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.answer.id).toBeInstanceOf(UniqueEntityId);
      expect(result.value.answer.content).toEqual('Nova respostas');
    }
  });

  it('should return an error if questionId is invalid', async () => {
    vi.spyOn(questionRepository, 'findById').mockResolvedValueOnce(null);

    const result = await sut.execute({
      questionId: 'fake_question_id',
      instructorId: '1',
      content: 'Nova respostas',
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be able to answer a question with attachments', async () => {
    vi.spyOn(questionRepository, 'findById').mockResolvedValueOnce(
      makeFakeQuestion('fake_question_id'),
    );

    const response = await sut.execute({
      questionId: 'fake_question_id',
      instructorId: '1',
      content: 'Nova respostas',
      attachmentsIds: ['1', '2'],
    });

    expect(response.isRight()).toBeTruthy();
    if (response.isRight()) {
      expect(response.value.answer.attachments.getItems()).toHaveLength(2);
    }
  });
});
