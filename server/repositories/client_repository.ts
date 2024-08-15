import type { PrismaClient } from '@prisma/client'
import type { GrantIdentifier, OAuthClient, OAuthClientRepository } from '@jmondi/oauth2-server'

import { Client } from '../entities/client.js'

export class ClientRepository implements OAuthClientRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getByIdentifier(clientId: string): Promise<Client> {
    const client = await this.prisma.oAuthClient.findUnique({
      where: {
        id: clientId
      },
      include: {
        scopes: true
      }
    })
    if (!client) throw new Error('Client not found')
    return new Client(client)
  }

  async isClientValid(grantType: GrantIdentifier, client: OAuthClient, clientSecret?: string): Promise<boolean> {
    if (client.secret && client.secret !== clientSecret) {
      return false
    }
    return client.allowedGrants.includes(grantType)
  }
}
