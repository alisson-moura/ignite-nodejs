import { type UniqueEntityId } from '@/core/entities/unique-entity-id';
import { type Optional } from '@/core/types/optional';
import { Slug } from './value-objects/slug';
import dayjs from 'dayjs';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { QuestionAttachmentList } from './question-attachment-list';
import { BestAnswerChosenEvent } from '../events/best-answer-chose-event';

interface QuestionProps {
  authorId: UniqueEntityId;
  bestAnswerId?: UniqueEntityId | null;
  title: string;
  content: string;
  slug: Slug;
  attachments: QuestionAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Question extends AggregateRoot<QuestionProps> {
  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityId,
  ): Question {
    return new Question(
      {
        createdAt: new Date(),
        slug: Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        ...props,
      },
      id,
    );
  }

  get authorId(): UniqueEntityId {
    return this.props.authorId;
  }

  get slug(): Slug {
    return this.props.slug;
  }

  get attachments(): QuestionAttachmentList {
    return this.props.attachments;
  }

  set attachments(items: QuestionAttachmentList) {
    this.props.attachments = items;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3;
  }

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  get title(): string {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);

    this.touch();
  }

  get content(): string {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  get bestAnswerId(): UniqueEntityId | undefined | null {
    return this.props.bestAnswerId;
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
    if (bestAnswerId === undefined) {
      return;
    }
    if (
      this.props.bestAnswerId == undefined ||
      !this.props.bestAnswerId.equals(bestAnswerId)
    ) {
      this.addDomainEvent(new BestAnswerChosenEvent(this, bestAnswerId));
    }

    this.props.bestAnswerId = bestAnswerId;
    this.touch();
  }
}
