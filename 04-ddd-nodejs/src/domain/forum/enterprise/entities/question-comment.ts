import { Entity } from '@/core/entities/entity';
import { type UniqueEntityId } from '@/core/entities/unique-entity-id';
import { type Optional } from '@/core/types/optional';

export interface QuestionCommentProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date
}

export class QuestionComment extends Entity<QuestionCommentProps> {
  static create (
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId): QuestionComment {
    return new QuestionComment({
      createdAt: new Date(),
      ...props
    }, id);
  }

  get authorId (): UniqueEntityId {
    return this.props.authorId;
  }

  get questionId (): UniqueEntityId {
    return this.props.questionId;
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
