import { type UniqueEntityId } from '@/core/entities/unique-entity-id';
import { type Optional } from '@/core/types/optional';
import { Slug } from './value-objects/slug';
import dayjs from 'dayjs';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { type QuestionAttachment } from './question-attachment';

interface QuestionProps {
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  title: string
  content: string
  slug: Slug
  attachments: QuestionAttachment[]
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  static create (props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>, id?: UniqueEntityId): Question {
    return new Question({
      createdAt: new Date(),
      slug: Slug.createFromText(props.title),
      attachments: props.attachments ?? [],
      ...props
    }, id);
  }

  get authorId (): UniqueEntityId {
    return this.props.authorId;
  }

  get slug (): Slug {
    return this.props.slug;
  }

  get attachments (): QuestionAttachment[] {
    return this.props.attachments;
  }

  set attachments (items: QuestionAttachment[]) {
    this.props.attachments = items;
  }

  get createdAt (): Date {
    return this.props.createdAt;
  }

  get updatedAt (): Date | undefined {
    return this.props.updatedAt;
  }

  get isNew (): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3;
  }

  get excerpt (): string {
    return this.content
      .substring(0, 120)
      .trimEnd()
      .concat('...');
  }

  private touch (): void {
    this.props.updatedAt = new Date();
  }

  get title (): string {
    return this.props.title;
  }

  set title (title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);

    this.touch();
  }

  get content (): string {
    return this.props.content;
  }

  set content (content: string) {
    this.props.content = content;
    this.touch();
  }

  get bestAnswerId (): UniqueEntityId | undefined {
    return this.props.bestAnswerId;
  }

  set bestAnswerId (bestAnswerId: UniqueEntityId | undefined) {
    this.props.bestAnswerId = bestAnswerId;
    this.touch();
  }
}
