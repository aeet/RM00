import type { OAuthClient as ClientModel, OAuthScope as ScopeModel } from '@prisma/client'
import type { OAuthClient, GrantIdentifier } from '@jmondi/oauth2-server'
import { Scope } from './scope'

type Relations = {
  scopes: ScopeModel[]
  allowedGrants: GrantIdentifier[]
}

export class Client implements ClientModel, OAuthClient {
  readonly id: string
  clientId: string
  name: string
  secret: string
  redirectUris: string[]
  allowedGrants: GrantIdentifier[]
  scopes: Scope[]

  constructor(client: ClientModel & Partial<Relations>) {
    this.id = client.id
    this.clientId = client.clientId
    this.name = client.name
    this.secret = client.secret
    this.redirectUris = client.redirectUris
    this.allowedGrants = client.allowedGrants
    this.scopes = client.scopes?.map(scope => new Scope(scope))
  }
}
