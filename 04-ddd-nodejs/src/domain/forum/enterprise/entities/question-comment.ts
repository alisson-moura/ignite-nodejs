import { type UniqueEntityId } from '@/core/entities/unique-entity-id';
import { type Optional } from '@/core/types/optional';
import { Comment, type CommentProps } from './comment';

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  static create (
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId): QuestionComment {
    return new QuestionComment({
      createdAt: new Date(),
      ...props
    }, id);
  }

  get questionId (): UniqueEntityId {
    return this.props.questionId;
  }
}
