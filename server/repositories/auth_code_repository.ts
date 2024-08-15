import type { PrismaClient } from '@prisma/client'
import type { OAuthAuthCode, OAuthAuthCodeRepository } from '@jmondi/oauth2-server'
import { DateInterval, generateRandomToken } from '@jmondi/oauth2-server'

import { AuthCode } from '../entities/auth_code.js'
import type { Client } from '../entities/client.js'
import type { Scope } from '../entities/scope.js'
import type { User } from '../entities/user.js'

export class AuthCodeRepository implements OAuthAuthCodeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getByIdentifier(authCodeCode: string): Promise<AuthCode> {
    const entity = await this.prisma.oAuthAuthCode.findUnique({
      where: {
        code: authCodeCode
      },
      include: {
        client: true
      }
    })
    if (!entity) throw new Error('AuthCode not found')
    return new AuthCode(entity)
  }

  async isRevoked(authCodeCode: string): Promise<boolean> {
    const authCode = await this.getByIdentifier(authCodeCode)
    return authCode.isExpired
  }

  issueAuthCode(client: Client, user: User | undefined, scopes: Scope[]): OAuthAuthCode {
    const { codeExpiresAt, requiresS256 } = useRuntimeConfig().oauth.server
    return new AuthCode({
      redirectUri: null,
      code: generateRandomToken(),
      codeChallenge: null,
      codeChallengeMethod: requiresS256 ? 'S256' : 'plain',
      expiresAt: new DateInterval(codeExpiresAt).getEndDate(),
      client,
      clientId: client.id,
      user,
      userId: user?.id ?? null,
      scopes
    })
  }

  async persist({ user, client, scopes, ...authCode }: AuthCode): Promise<void> {
    await this.prisma.oAuthAuthCode.create({ data: authCode })
  }

  async revoke(authCodeCode: string): Promise<void> {
    await this.prisma.oAuthAuthCode.update({
      where: { code: authCodeCode },
      data: {
        expiresAt: new Date(0)
      }
    })
  }
}
