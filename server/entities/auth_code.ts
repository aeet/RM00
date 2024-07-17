import type { CodeChallengeMethod, OAuthAuthCode } from '@jmondi/oauth2-server'
import type {
  OAuthClient as ClientModel,
  OAuthAuthCode as AuthCodeModel,
  OAuthScope as ScopeModel,
  OAuthUser as UserModel
} from '@prisma/client'
import { Scope } from './scope'
import { Client } from './client'
import { User } from './user'

type Optional = Partial<{
  user: UserModel
  scopes: ScopeModel[]
}>

type Required = {
  client: ClientModel
}

export class AuthCode implements AuthCodeModel, OAuthAuthCode {
  readonly id: string
  readonly code: string
  codeChallenge: string | null
  codeChallengeMethod: CodeChallengeMethod
  redirectUri: string | null
  expiresAt: Date
  userId: string | null
  user: User | null
  clientId: string
  client: Client
  scopes: Scope[]

  constructor(entity: AuthCodeModel & Required & Optional) {
    this.code = entity.code
    this.codeChallenge = entity.codeChallenge
    this.codeChallengeMethod = entity.codeChallengeMethod
    this.redirectUri = entity.redirectUri
    this.user = entity.user ? new User(entity.user) : null
    this.userId = entity.userId
    this.client = new Client(entity.client)
    this.clientId = entity.clientId
    this.scopes = entity.scopes?.map(s => new Scope(s)) ?? []
    this.expiresAt = new Date()
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt
  }
}
