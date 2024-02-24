import {
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from '../pipes/zod-validation-pipes'
import { PrismaSerivice } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type createAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaSerivice) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: createAccountBodySchema) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new ConflictException('Email already exists')
    }

    const hashPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: { name, email, password: hashPassword },
    })
  }
}