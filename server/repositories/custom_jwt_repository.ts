import { JwtService, type ExtraAccessTokenFieldArgs } from '@jmondi/oauth2-server'

export class CustomJwtRepository extends JwtService {
  extraTokenFields({ user, client }: ExtraAccessTokenFieldArgs) {
    return {
      email: user?.email,
      client: client.name
    }
  }
}
