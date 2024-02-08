import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CreateNotificationRepository } from '../repositories/notification-repository';
import { SendNotificationUseCase } from './send-notification';

let notificationRepository: CreateNotificationRepository;
let sut: SendNotificationUseCase;

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    notificationRepository = {
      async create() {},
    };
    sut = new SendNotificationUseCase(notificationRepository);
  });

  it('should be able to send a notification', async () => {
    const response = await sut.execute({
      recipientId: '1',
      title: 'Fake title',
      content: 'fake description.',
    });

    expect(response.isRight()).toBeTruthy();
    if (response.isRight()) {
      expect(response.value.notification.id).toBeInstanceOf(UniqueEntityId);
    }
  });
});
