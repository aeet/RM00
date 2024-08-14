import type { OAuthScope as ScopeModel, OAuthClient as ClientModel, OAuthUser as UserModel, OAuthToken as TokenModel } from '@prisma/client'
import type { OAuthToken } from '@jmondi/oauth2-server'

import { Client } from './client.js'
import { Scope } from './scope.js'
import { User } from './user.js'

type Relations = Partial<{
  user: UserModel | null
  scopes: ScopeModel[] | null
}>

type Required = {
  client: ClientModel
}

export class Token implements TokenModel, OAuthToken {
  readonly id: string
  accessToken: string
  accessTokenExpiresAt: Date
  refreshToken: string | null
  refreshTokenExpiresAt: Date | null
  client: Client
  clientId: string
  user: User | null
  userId: string | null
  scopes: Scope[]
  originatingAuthCodeId: string | null

  constructor({ client, user, scopes, ...entity }: TokenModel & Required & Relations) {
    this.accessToken = entity.accessToken
    this.accessTokenExpiresAt = entity.accessTokenExpiresAt
    this.refreshToken = entity.refreshToken
    this.refreshTokenExpiresAt = entity.refreshTokenExpiresAt
    this.user = user ? new User(user) : null
    this.userId = entity.userId
    this.client = new Client(client)
    this.clientId = entity.clientId
    this.scopes = scopes?.map(s => new Scope(s)) ?? []
  }

  get isRevoked() {
    return Date.now() > this.accessTokenExpiresAt.getTime()
  }

  revoke() {
    this.accessTokenExpiresAt = new Date(0)
    this.refreshTokenExpiresAt = new Date(0)
  }
}
