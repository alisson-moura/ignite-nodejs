import { Entity } from '@/core/entities/entity';
import { type UniqueEntityId } from '@/core/entities/unique-entity-id';

interface QuestionAttachmentProps {
  questionId: UniqueEntityId;
  attachmentId: UniqueEntityId;
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId(): UniqueEntityId {
    return this.props.questionId;
  }

  get attachmentId(): UniqueEntityId {
    return this.props.attachmentId;
  }

  static create(
    props: QuestionAttachmentProps,
    id?: UniqueEntityId,
  ): QuestionAttachment {
    const questionAttachment = new QuestionAttachment(props, id);

    return questionAttachment;
  }
}
