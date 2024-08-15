import type { GrantIdentifier, OAuthUserRepository } from '@jmondi/oauth2-server'
import type { PrismaClient } from '@prisma/client'

import type { Client } from '../entities/client.js'
import { User } from '../entities/user.js'

export class UserRepository implements OAuthUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getUserByCredentials(
    identifier: string,
    password?: string,
    _grantType?: GrantIdentifier,
    _client?: Client
  ): Promise<User> {
    const user = new User(
      await this.prisma.user.findUnique({
        where: { id: identifier }
      })
    )
    if (!user) throw new Error('user not found')
    if (password) await user.verify(password)
    return user
  }
}
