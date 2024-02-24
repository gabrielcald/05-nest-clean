import { AppModule } from '@/infra/app.module'
import { PrismaSerivice } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create account (E2E)', () => {
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

  test('[POST] /accounts', async () => {
    await request(app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'John Doe',
        email: 'jondoe@example.com',
        password: 'password',
      })
      .expect(201)

    const userOnDatabse = await prisma.user.findUnique({
      where: { email: 'jondoe@example.com' },
    })

    expect(userOnDatabse).toBeTruthy()
  })
})
