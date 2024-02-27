import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { compare, hash } from 'bcryptjs'

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  hash(plaintext: string): Promise<string> {
    return hash(plaintext, this.HASH_SALT_LENGTH)
  }

  compare(plaintext: string, hash: string): Promise<boolean> {
    return compare(plaintext, hash)
  }
}
