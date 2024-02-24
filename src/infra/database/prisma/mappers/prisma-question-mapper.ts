import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Question as PrismaQuestion } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain(row: PrismaQuestion): Question {
    return Question.create(
      {
        title: row.title,
        content: row.content,
        authorId: new UniqueEntityID(row.authorId),
        bestAnswerId: undefined,
        slug: Slug.create(row.slug),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      new UniqueEntityID(row.id),
    )
  }
}
