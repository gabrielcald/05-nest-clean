import { AppModule } from '@/infra/app.module'
import { PrismaSerivice } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaSerivice
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaSerivice)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'jondoe@example.com',
        password: 'password',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'How to create a question?',
        content: 'I want to create a question, but I do not know how to do it',
      })
      .expect(201)

    const questionOnDatabase = await prisma.question.findFirst({
      where: { title: 'How to create a question?' },
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})
