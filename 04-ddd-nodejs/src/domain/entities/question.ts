import { randomUUID } from "node:crypto"
import { Slug } from "./value-objects/slug"
import { Entity } from "../../core/entities/entity"
import { UniqueEntityId } from "../../core/entities/unique-entity-id"
import { Optional } from "../../core/types/optional"

interface QuestionProps {
  authorId: UniqueEntityId
  bestAnswerId: UniqueEntityId
  title: string
  content: string
  slug: Slug
  createdAt: Date
  updatedAt?:Date
}
export class Question extends Entity<QuestionProps> { 
  static create(props: Optional<QuestionProps, 'createdAt'>, id?: UniqueEntityId) {
    return new Question({
      createdAt: new Date(),
      ...props
    }, id)
  }
}