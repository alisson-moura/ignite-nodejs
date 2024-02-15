import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswersRepository } from '../repositories/answers-repository';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers';
import { Answer } from '../../enterprise/entities/answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answer-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let answersRepository: AnswersRepository;
let sut: FetchQuestionAnswersUseCase;

const makeFakeAnswer = (questionId: string): Answer =>
  Answer.create({
    authorId: new UniqueEntityId('fake_author_id'),
    content: faker.lorem.sentence(),
    questionId: new UniqueEntityId(questionId),
  });

describe('Fetch Questions Answers Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository(
      new InMemoryAnswerAttachmentsRepository(),
    );
    sut = new FetchQuestionAnswersUseCase(answersRepository);
  });

  it('Should be able to get a question answers', async () => {
    vi.spyOn(answersRepository, 'findManyByQuestionId').mockResolvedValueOnce([
      makeFakeAnswer('fake_question_id'),
      makeFakeAnswer('fake_question_id'),
    ]);

    const result = await sut.execute({
      page: 1,
      questionId: 'fake_question_id',
    });

    expect(result.isRight());
    if (result.isRight()) {
      expect(result.value.answers.length).toEqual(2);
    }
  });
});
