import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { right, type Either } from '@/core/either';
import { Notification } from '../../enterprise/entities/notification';
import { CreateNotificationRepository } from '../repositories/notification-repository';


interface Request {
  recipientId: string
  content: string
  title: string
}
type Response = Either<null, {
  notification: Notification
}>;

export class SendNotificationUseCase {
  constructor (
    private readonly notificationRepository: CreateNotificationRepository
  ) { }

  public async execute ({ recipientId, content, title }: Request): Promise<Response> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content
    });

    await this.notificationRepository.create(notification);
    return right({ notification });
  }
}
