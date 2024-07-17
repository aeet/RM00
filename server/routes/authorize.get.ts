import { useOAuthServer } from '../composables/oauth/use_oauth_server'
import { h3ReqToRequestInterface } from '../tools/converts'

export default defineEventHandler(async (event) => {
  try {
    const oauth = useOAuthServer()
    const req = await h3ReqToRequestInterface(event)
    const authRequest = await oauth.validateAuthorizationRequest(req)
    authRequest.isAuthorizationApproved = true
    const oauthResponse = await oauth.completeAuthorizationRequest(authRequest)
    return oauthResponse
  } catch (e) {
    return createError({ status: 400, message: e.message })
  }
})
