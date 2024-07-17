import type { OAuthUser as UserModel } from '@prisma/client'
import type { OAuthUser } from '@jmondi/oauth2-server'
import bcrypt from 'bcryptjs'

export class User implements UserModel, OAuthUser {
  readonly id: string
  name: string
  account: string
  email: string
  password: string

  constructor(user: UserModel) {
    this.id = user.id
    this.name = user.name
    this.account = user.account
    this.email = user.email
    this.password = user.password
  }

  async setPassword(password: string) {
    this.password = await bcrypt.hash(password, 12)
  }

  async verify(password: string) {
    if (!(await bcrypt.compare(password, this.password))) {
      throw new Error('invalid password')
    }
  }
}
