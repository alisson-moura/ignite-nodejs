import { Comment, type CommentProps } from './comment';
import { type UniqueEntityId } from '@/core/entities/unique-entity-id';
import { type Optional } from '@/core/types/optional';

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId
}

export class AnswerComment extends Comment <AnswerCommentProps> {
  static create (
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityId): AnswerComment {
    return new AnswerComment({
      createdAt: new Date(),
      ...props
    }, id);
  }

  get answerId (): UniqueEntityId {
    return this.props.answerId;
  }
}
