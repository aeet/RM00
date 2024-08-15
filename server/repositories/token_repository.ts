import type { PrismaClient } from '@prisma/client'

import { DateInterval, generateRandomToken, type OAuthClient, type OAuthTokenRepository } from '@jmondi/oauth2-server'
import type { Client } from '../entities/client.js'
import type { Scope } from '../entities/scope.js'
import { Token } from '../entities/token.js'
import type { User } from '../entities/user.js'
import { usePrisma } from '../composables/use_prisma.js'

export class TokenRepository implements OAuthTokenRepository {
  constructor(private readonly prisma: PrismaClient = usePrisma()) {}

  async findById(accessToken: string): Promise<Token> {
    const _token = await this.prisma.oAuthToken.findUnique({
      where: {
        accessToken
      },
      include: {
        user: true,
        client: true,
        scopes: true
      }
    })
    if (!_token) throw new Error('Token not found')
    return new Token(_token)
  }

  async issueToken(client: Client, scopes: Scope[], user?: User): Promise<Token> {
    const { accessTokenExpiresAt } = useRuntimeConfig().oauth.server
    return new Token({
      accessToken: generateRandomToken(),
      accessTokenExpiresAt: new DateInterval(accessTokenExpiresAt).getEndDate(),
      refreshToken: null,
      refreshTokenExpiresAt: null,
      client,
      clientId: client.id,
      user: user,
      userId: user?.id ?? null,
      scopes
    })
  }

  async getByRefreshToken(refreshToken: string): Promise<Token> {
    const _token = await this.prisma.oAuthToken.findUnique({
      where: { refreshToken },
      include: {
        client: true,
        scopes: true,
        user: true
      }
    })
    if (!_token) throw new Error('Token not found')
    return new Token(_token)
  }

  async isRefreshTokenRevoked(token: Token): Promise<boolean> {
    return Date.now() > (token.refreshTokenExpiresAt?.getTime() ?? 0)
  }

  async issueRefreshToken(token: Token, _: OAuthClient): Promise<Token> {
    const { refreshTokenExpiresAt } = useRuntimeConfig().oauth.server
    token.refreshToken = generateRandomToken()
    token.refreshTokenExpiresAt = new DateInterval(refreshTokenExpiresAt).getEndDate()
    await this.prisma.oAuthToken.update({
      where: {
        accessToken: token.accessToken
      },
      data: {
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt
      }
    })
    return token
  }

  async persist({ user, client, scopes, ...token }: Token): Promise<void> {
    await this.prisma.oAuthToken.upsert({
      where: {
        accessToken: token.accessToken
      },
      update: {},
      create: token
    })
  }

  async revoke(accessToken: Token): Promise<void> {
    accessToken.revoke()
    await this.update(accessToken)
  }

  private async update({ user, client, scopes, ...token }: Token): Promise<void> {
    await this.prisma.oAuthToken.update({
      where: {
        accessToken: token.accessToken
      },
      data: token
    })
  }
}
