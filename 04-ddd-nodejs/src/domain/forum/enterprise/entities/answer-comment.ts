import { Entity } from '@/core/entities/entity';
import { type UniqueEntityId } from '@/core/entities/unique-entity-id';
import { type Optional } from '@/core/types/optional';

export interface AnswerCommentProps {
  authorId: UniqueEntityId
  answerId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date
}

export class AnswerComment extends Entity<AnswerCommentProps> {
  static create (
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityId): AnswerComment {
    return new AnswerComment({
      createdAt: new Date(),
      ...props
    }, id);
  }

  get authorId (): UniqueEntityId {
    return this.props.authorId;
  }

  get answerId (): UniqueEntityId {
    return this.props.answerId;
  }

  get createdAt (): Date {
    return this.props.createdAt;
  }

  get updatedAt (): Date | undefined {
    return this.props.updatedAt;
  }

  private touch (): void {
    this.props.updatedAt = new Date();
  }

  get content (): string {
    return this.props.content;
  }

  set content (content: string) {
    this.props.content = content;
    this.touch();
  }
}
