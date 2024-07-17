import type { ExtraAccessTokenFieldArgs } from '@jmondi/oauth2-server'
import { JwtService } from '@jmondi/oauth2-server'

export class CustomJwtRepository extends JwtService {
  extraTokenFields({ user }: ExtraAccessTokenFieldArgs) {
    return {
      user: user
    }
  }
}
