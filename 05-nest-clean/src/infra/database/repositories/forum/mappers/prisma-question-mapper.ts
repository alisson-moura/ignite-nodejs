import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Prisma, Question as PrismaQuestion } from "@prisma/client";

export class PrismaQuestionMapper {
    static toDomain(raw: PrismaQuestion): Question {
        return Question.create({
            title: raw.title,
            content: raw.content,
            bestAnswerId: raw.bestAnswerId ? new UniqueEntityId(raw.bestAnswerId) : null,
            authorId: new UniqueEntityId(),
            slug: new Slug(raw.slug),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, new UniqueEntityId(raw.id))
    }

    static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput{
        return {
            id: question.id.toString(),
            authorId: question.authorId.toString(),
            content: question.content,
            slug: question.slug.value,
            title: question.title,
            bestAnswerId: question.bestAnswerId?.toString(),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt
        }
    }
}