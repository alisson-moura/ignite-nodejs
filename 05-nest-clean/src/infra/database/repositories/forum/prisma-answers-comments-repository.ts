import { PaginationParams } from "@/core/repositories/pagination";
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answers-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAnswerCommentRepository implements AnswerCommentRepository {
  async create (comment: AnswerComment): Promise<void> {}
  async find (id: string): Promise<AnswerComment | null> { return null }
  async delete (comment: AnswerComment): Promise<void> {}
  async findMany (answerId: string, pagination: PaginationParams): Promise<AnswerComment[]> {return []}
}