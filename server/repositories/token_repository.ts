import { DateInterval, generateRandomToken, type OAuthTokenRepository } from '@jmondi/oauth2-server'
import { Token } from '../entities/token'
import type { Scope } from '../entities/scope'
import type { User } from '../entities/user'
import type { Client } from '../entities/client'
import { usePrisma } from '../composables/use_prisma'

export class TokenRepository implements OAuthTokenRepository {
  async issueToken(client: Client, scopes: Scope[], user?: User | null): Promise<Token> {
    const { accessTokenExpiresAt } = useRuntimeConfig().oauth.server
    return new Token({
      id: null,
      accessToken: generateRandomToken(),
      accessTokenExpiresAt: new DateInterval(accessTokenExpiresAt).getEndDate(),
      refreshToken: null,
      refreshTokenExpiresAt: null,
      client,
      clientId: client.clientId,
      user: user,
      userId: user.id ?? null,
      scopes: scopes,
      originatingAuthCodeId: null
    })
  }

  async issueRefreshToken(token: Token, _client: Client): Promise<Token> {
    const prisma = usePrisma()
    const { refreshTokenExpiresAt } = useRuntimeConfig().oauth.server
    token.refreshToken = generateRandomToken()
    token.refreshTokenExpiresAt = new DateInterval(refreshTokenExpiresAt).getEndDate()
    await prisma.oAuthToken.update({
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

  async persist(token: Token): Promise<void> {
    const prisma = usePrisma()
    await prisma.oAuthToken.upsert({
      where: {
        accessToken: token.accessToken
      },
      update: {},
      create: token
    })
  }

  async revoke(token: Token): Promise<void> {
    const prisma = usePrisma()
    token.revoke()
    await prisma.oAuthToken.update({
      where: {
        accessToken: token.accessToken
      },
      data: token
    })
  }

  async isRefreshTokenRevoked(token: Token): Promise<boolean> {
    return Date.now() > (token.refreshTokenExpiresAt?.getTime() ?? 0)
  }

  async getByRefreshToken(refreshToken: string): Promise<Token> {
    const prisma = usePrisma()
    const _token = await prisma.oAuthToken.findUnique({
      where: { refreshToken },
      include: {
        OAuthClient: {
          include: {
            OAuthClientGrant: true,
            OAuthAuthCode: true,
            OAuthClientScope: { include: { OAuthScope: true } }
          }
        },
        OAuthTokenScope: { include: { OAuthScope: true } },
        OAuthUser: true
      }
    })
    if (!_token) throw new Error('token not found')
    const token = new Token({
      id: _token.id,
      accessToken: _token.accessToken,
      accessTokenExpiresAt: _token.accessTokenExpiresAt,
      refreshToken: _token.refreshToken,
      refreshTokenExpiresAt: _token.refreshTokenExpiresAt,
      client: _token.OAuthClient,
      clientId: _token.clientId,
      user: _token.OAuthUser,
      userId: _token.userId,
      scopes: _token.OAuthTokenScope.map(s => s.OAuthScope),
      originatingAuthCodeId: _token.originatingAuthCodeId ?? null
    })
    return token
  }

  async getByAccessToken?(accessToken: string): Promise<Token> {
    const prisma = usePrisma()
    const _token = await prisma.oAuthToken.findUnique({
      where: { accessToken },
      include: {
        OAuthClient: {
          include: {
            OAuthClientGrant: true,
            OAuthAuthCode: true,
            OAuthClientScope: { include: { OAuthScope: true } }
          }
        },
        OAuthTokenScope: { include: { OAuthScope: true } },
        OAuthUser: true
      }
    })
    if (!_token) throw new Error('token not found')
    const token = new Token({
      id: _token.id,
      accessToken: _token.accessToken,
      accessTokenExpiresAt: _token.accessTokenExpiresAt,
      refreshToken: _token.refreshToken,
      refreshTokenExpiresAt: _token.refreshTokenExpiresAt,
      client: _token.OAuthClient,
      clientId: _token.clientId,
      user: _token.OAuthUser,
      userId: _token.userId,
      scopes: _token.OAuthTokenScope.map(s => s.OAuthScope),
      originatingAuthCodeId: _token.originatingAuthCodeId ?? null
    })
    return token
  }
}
