import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { FindQuestionByIdRepository } from '@/domain/forum/application/repositories/question-repository';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event';
import { SendNotificationUseCase } from '../use-cases/send-notification';

export class OnAnsweCreated implements EventHandler {
  constructor(
    private sendNotification: SendNotificationUseCase,
    private questionsRepository: FindQuestionByIdRepository,
  ) {
    this.setupSubscriptions();
  }
  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    );
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.find(
      answer.questionId.toString(),
    );
    if (question) {
      await this.sendNotification.execute({
        recipientId: question?.authorId.toString(),
        title: `Nova resposta em  "${question.title.substring(0, 20).concat('...')}"`,
        content: answer.excerpt,
      });
    }
  }
}
