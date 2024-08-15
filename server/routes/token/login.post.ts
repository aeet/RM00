import { useOAuthServer } from '../../composables/oauth/use_oauth_server'
import { requestFromH3, handleErrorWithH3, responseWithH3 } from '../../tools/converts'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  body.grant_type = 'passowrd'
  body.client_id = useRuntimeConfig().oauth.client.clientId
  body.client_secret = useRuntimeConfig().oauth.client.secret
  try {
    const oauthServer = useOAuthServer()
    const oauthResponse = await oauthServer.respondToAccessTokenRequest(await requestFromH3(event))
    responseWithH3(event, oauthResponse)
  } catch (e) {
    handleErrorWithH3(event, e)
  }
})
