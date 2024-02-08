import { AppModule } from '@/app.module'
import { PrismaSerivice } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Test authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaSerivice

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaSerivice)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'jondoe@example.com',
        password: await hash('password', 8),
      },
    })

    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'jondoe@example.com',
        password: 'password',
      })
      .expect(201)

    expect(response.body).toEqual({ access_token: expect.any(String) })
  })
})
