import { randomUUID } from "node:crypto"
import { Slug } from "./value-objects/slug"

interface QuestionConstructor {
  title: string
  content: string
  authorId: string
  slug: Slug
}
export class Question {
  public id: string
  public title: string
  public content: string
  public authorId: string
  public slug: Slug

  constructor(props: QuestionConstructor, id?: string) {
    this.title = props.title
    this.content = props.content
    this.authorId = props.authorId
    this.slug = props.slug
    this.id = id ?? randomUUID()
  }
}