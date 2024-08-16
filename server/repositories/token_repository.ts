import type { PrismaClient } from '@prisma/client'

import { DateInterval, generateRandomToken, type OAuthClient, type OAuthTokenRepository } from '@jmondi/oauth2-server'
import type { Client } from '../entities/client.js'
import type { Scope } from '../entities/scope.js'
import { Token } from '../entities/token.js'
import type { User } from '../entities/user.js'
import { usePrisma } from '../composables/use_prisma.js'

export class TokenRepository implements OAuthTokenRepository {
  constructor(private readonly prisma: PrismaClient = usePrisma()) {}

  async issueToken(client: Client, scopes: Scope[], user?: User): Promise<Token> {
    const prisma = usePrisma()
    // check if there is a valid token by client and user
    if (client && user) {
      console.log(11111111)
      console.log(client)
      console.log(user)
      const token = await prisma.oAuthToken.findFirst({
        where: {
          clientId: client.id,
          userId: user?.id,
          accessTokenExpiresAt: {
            lt: new Date()
          }
        },
        include: {
          client: true,
          user: true
        }
      })
      console.log('ttt:', token)
      if (token) return new Token(token)
    }
    // check if there is a valid token by client
    if (client && !user) {
      console.log(2222222)
      const token = await prisma.oAuthToken.findFirst({
        where: {
          clientId: client.id,
          accessTokenExpiresAt: {
            lt: new Date()
          }
        },
        include: {
          client: true
        }
      })
      if (token) return new Token(token)
    }
    // create new token
    console.log(33333)
    console.log('今天', new Date())
    const { accessTokenExpiresAt } = useRuntimeConfig().oauth.server
    console.log('未来一天', new DateInterval(accessTokenExpiresAt).getEndDate())
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
    console.log('persist', token)
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
