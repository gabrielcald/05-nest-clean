import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher

let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('Should be able to register a new student', async () => {
    const student = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'password',
    })

    expect(student.isRight()).toBe(true)
    expect(student.value).toEqual({
      student: inMemoryStudentsRepository.students[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const student = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(student.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.students[0].password).toEqual(
      hashedPassword,
    )
  })
})
