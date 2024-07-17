import { AuthorizationServer } from '@jmondi/oauth2-server'
import { ClientRepository } from '../../repositories/client_repository'
import { TokenRepository } from '../../repositories/token_repository'
import { ScopeRepository } from '../../repositories/scope_repository'
import { CustomJwtRepository } from '../../repositories/custom_jwt_repository'
import { AuthCodeRepository } from '../../repositories/auth_code_repository'
import { UserRepository } from '../../repositories/user_repository'

const createOAuthServer = (): () => AuthorizationServer => {
  let oauthServer: AuthorizationServer | null = null
  return (): AuthorizationServer => {
    if (oauthServer) return oauthServer
    const config = useRuntimeConfig().oauth.server
    const clientRepository = new ClientRepository()
    const tokenRepository = new TokenRepository()
    const scopeRepository = new ScopeRepository()
    const authCodeRepository = new AuthCodeRepository()
    const userRepository = new UserRepository()
    const customJwtRepository = new CustomJwtRepository(config.secret)
    oauthServer = new AuthorizationServer(
      clientRepository,
      tokenRepository,
      scopeRepository,
      customJwtRepository as any,
      config as any
    )
    oauthServer.enableGrantTypes(
      'client_credentials',
      'implicit',
      'refresh_token',
      { grant: 'password', userRepository },
      { grant: 'authorization_code', authCodeRepository, userRepository }
    )
    return oauthServer
  }
}

export const useOAuthServer = createOAuthServer()
