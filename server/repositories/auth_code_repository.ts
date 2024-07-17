import { DateInterval, generateRandomToken, type OAuthAuthCode, type OAuthAuthCodeRepository } from '@jmondi/oauth2-server'
import { usePrisma } from '../composables/use_prisma'
import { AuthCode } from '../entities/auth_code'
import type { User } from '../entities/user'
import type { Client } from '../entities/client'
import type { Scope } from '../entities/scope'

export class AuthCodeRepository implements OAuthAuthCodeRepository {
  async getByIdentifier(authCodeCode: string): Promise<AuthCode> {
    const prisma = usePrisma()
    const _authCode = await prisma.oAuthAuthCode.findUnique({
      where: {
        code: authCodeCode
      },
      include: {
        OAuthClient: true,
        OAuthCodeScope: {
          include: {
            OAuthScope: true
          }
        },
        OAuthUser: true
      }
    })
    if (!_authCode) throw new Error('auth code not found')
    const authCode = new AuthCode({
      id: _authCode.id,
      code: _authCode.code,
      codeChallenge: _authCode.codeChallenge,
      codeChallengeMethod: _authCode.codeChallengeMethod,
      redirectUri: _authCode.redirectUri,
      expiresAt: _authCode.expiresAt,
      userId: _authCode.userId,
      user: _authCode.OAuthUser,
      clientId: _authCode.clientId,
      client: _authCode.OAuthClient,
      scopes: _authCode.OAuthCodeScope.map(s => s.OAuthScope)
    })
    return authCode
  }

  issueAuthCode(client: Client, user: User | undefined, scopes: Scope[]): OAuthAuthCode | Promise<OAuthAuthCode> {
    const { codeExpiresAt } = useRuntimeConfig().oauth.server
    return new AuthCode({
      id: null,
      redirectUri: null,
      code: generateRandomToken(),
      codeChallenge: null,
      codeChallengeMethod: 'S256',
      expiresAt: new DateInterval(codeExpiresAt).getEndDate(),
      client,
      clientId: client.id,
      user,
      userId: user?.id ?? null,
      scopes
    })
  }

  async persist(authCode: AuthCode): Promise<void> {
    const prisma = usePrisma()
    await prisma.oAuthAuthCode.create({ data: authCode })
  }

  async isRevoked(authCodeCode: string): Promise<boolean> {
    const authCode = await this.getByIdentifier(authCodeCode)
    return authCode.isExpired
  }

  async revoke(authCodeCode: string): Promise<void> {
    const prisma = usePrisma()
    await prisma.oAuthAuthCode.update({
      where: { code: authCodeCode },
      data: {
        expiresAt: new Date(0)
      }
    })
  }
}
