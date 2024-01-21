import { Notification } from "../../enterprise/entities/notification"

export interface NotificationRepository extends
    CreateNotificationRepository { }

export interface CreateNotificationRepository {
    create: (notification: Notification) => Promise<void>
}
