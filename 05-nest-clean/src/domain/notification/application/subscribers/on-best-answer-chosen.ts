import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { FindAnswerByIdRepository } from "@/domain/forum/application/repositories/answers-repository";
import { BestAnswerChosenEvent } from "@/domain/forum/enterprise/events/best-answer-chose-event";


export class OnBestAnswerChosen implements EventHandler {
    constructor(
        private sendNotification: SendNotificationUseCase,
        private answerRepository: FindAnswerByIdRepository
    ) {
        this.setupSubscriptions()
    }
    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendBestAnswerChosenNotification.bind(this),
            BestAnswerChosenEvent.name
        )
    }

    private async sendBestAnswerChosenNotification({ question, bestAnswerId }: BestAnswerChosenEvent) {
        const answer = await this.answerRepository.find(bestAnswerId.toString())

        if (answer) {
            await this.sendNotification.execute({
                recipientId: answer.authorId.toString(),
                title: `Sua resposta foi escolhida!`,
                content: `A resposta que você enviou em "${question.title.substring(0, 20).concat('...')}" foi escolhida como a melhor pelo autor!`
            })
        }
    }
}