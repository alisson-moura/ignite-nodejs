import { randomUUID } from 'crypto'

export class Task {
  constructor({ title, description, id, created_at, updated_at, completed_at }) {
    this.id = id ? id : randomUUID()
    this.created_at = created_at ? created_at : new Date()
    this.updated_at = updated_at ? updated_at : this.created_at
    this.completed_at = completed_at ? completed_at : null

    this.title = title
    this.description = description
  }

  finish() {
    this.completed_at = new Date()
  }

  toJson() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      created_at: this.created_at,
      updated_at: this.updated_at,
      completed_at: this.completed_at
    }
  }
}