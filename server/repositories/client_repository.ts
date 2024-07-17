import type { GrantIdentifier, OAuthClient, OAuthClientRepository } from '@jmondi/oauth2-server'
import { usePrisma } from '../composables/use_prisma'
import { Client } from '../entities/client'

export class ClientRepository implements OAuthClientRepository {
  async getByIdentifier(clientId: string): Promise<Client> {
    const prisma = usePrisma()
    const _client = await prisma.oAuthClient.findUnique({
      where: { clientId: clientId },
      include: {
        OAuthClientGrant: true,
        OAuthClientScope: {
          include: { OAuthScope: true }
        }
      }
    })
    if (!_client) throw new Error('client not found')
    const client = new Client({
      ..._client,
      scopes: _client.OAuthClientScope.map(scope => scope.OAuthScope),
      allowedGrants: _client.OAuthClientGrant.map(grant => grant.grantType)
    })
    return client
  }

  async isClientValid(grantType: GrantIdentifier, client: OAuthClient, clientSecret?: string): Promise<boolean> {
    if (client.secret && client.secret !== clientSecret) return false
    return client.allowedGrants.includes(grantType)
  }
}
