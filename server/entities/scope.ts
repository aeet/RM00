import type { OAuthScope as ScopeModel } from '@prisma/client'
import type { OAuthScope } from '@jmondi/oauth2-server'

export class Scope implements ScopeModel, OAuthScope {
  readonly id: string
  name: string

  constructor(scope: ScopeModel) {
    this.id = scope.id
    this.name = scope.name
  }
}
