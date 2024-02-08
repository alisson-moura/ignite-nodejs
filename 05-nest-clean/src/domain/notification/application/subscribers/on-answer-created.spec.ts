import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import { OnAnsweCreated } from "./on-answer-created"
import { DomainEvents } from "@/core/events/domain-events";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { CreateNotificationRepository } from "../repositories/notification-repository";
import { Notification } from '../../enterprise/entities/notification';
import { FindQuestionByIdRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { waitFor } from "@/utils/wait-for";

const makeFakeAnswer = (): Answer => Answer.create({
    authorId: new UniqueEntityId('fake_author_id'),
    content: faker.lorem.sentence(),
    questionId: new UniqueEntityId('fake_question_id')
});

const makeFakeQuestion = (): Question => Question.create({
    authorId: new UniqueEntityId('fake_question_author_id'),
    content: faker.lorem.text(),
    title: faker.lorem.sentence()
}, new UniqueEntityId('fake_question_id'));

let questionRepository: FindQuestionByIdRepository;
let notificationRepository: CreateNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase

describe('On Answer Created', () => {
    beforeEach(() => {
        notificationRepository = {
            async create(notification: Notification) { }
        };
        questionRepository = {
            async find(id) {
                return null;
            }
        };
        sendNotificationUseCase = new SendNotificationUseCase(notificationRepository);
    })
    it('should send a notification when an answer is created', async () => {
        const sendNotificationExecuteSpy = vi
            .spyOn(sendNotificationUseCase, 'execute')

        vi.spyOn(questionRepository, 'find')
            .mockResolvedValueOnce(makeFakeQuestion())

        new OnAnsweCreated(sendNotificationUseCase, questionRepository)
        const answer = makeFakeAnswer()
        DomainEvents.dispatchEventsForAggregate(answer.id)

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })
    })
})