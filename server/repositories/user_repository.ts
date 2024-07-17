import type { GrantIdentifier, OAuthUserRepository } from '@jmondi/oauth2-server'

import type { Client } from '../entities/client.js'
import { usePrisma } from '../composables/use_prisma.js'
import { User } from '../entities/user.js'

export class UserRepository implements OAuthUserRepository {
  async getUserByCredentials(
    identifier: string,
    password?: string,
    _grantType?: GrantIdentifier,
    _client?: Client
  ): Promise<User> {
    const prisma = usePrisma()
    const user = new User(await prisma.oAuthUser.findUnique({ where: { id: identifier } }))
    if (!user) throw new Error('user not found')
    if (password) await user.verify(password)
    return user
  }
}
