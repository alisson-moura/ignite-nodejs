import { PaginationParams } from "@/core/repositories/pagination";
import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaQuestionCommentRepository implements QuestionCommentRepository {
  async create(comment: QuestionComment): Promise<void> { }
  async find(id: string): Promise<QuestionComment | null> { return null }
  async delete (comment: QuestionComment): Promise<void> {}
  async findMany (questionId: string, pagination: PaginationParams): Promise<QuestionComment[]> {
    return []
  }
}

