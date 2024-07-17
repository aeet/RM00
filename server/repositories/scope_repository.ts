import type { GrantIdentifier, OAuthClient, OAuthScope, OAuthScopeRepository, OAuthUserIdentifier } from '@jmondi/oauth2-server'
import { usePrisma } from '../composables/use_prisma'
import type { Scope } from '../entities/scope'

export class ScopeRepository implements OAuthScopeRepository {
  async getAllByIdentifiers(scopeNames: string[]): Promise<Scope[]> {
    const prisma = usePrisma()
    const scope = await prisma.oAuthScope.findMany({
      where: {
        name: {
          in: scopeNames
        }
      }
    })
    return scope
  }

  async finalize(scopes: OAuthScope[],
    _identifier: GrantIdentifier,
    _client: OAuthClient,
    _user_id?: OAuthUserIdentifier
  ): Promise<OAuthScope[]> {
    return scopes
  }
}
