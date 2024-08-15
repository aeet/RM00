import type { ModuleOptions } from 'nuxt-auth-toolkit'
import { useOAuthServer } from '../composables/oauth/use_oauth_server'
import { requestFromH3, handleErrorWithH3, responseWithH3 } from '../tools/converts'

export default defineEventHandler(async (event) => {
  try {
    const oauth = useOAuthServer()
    const authRequest = await oauth.validateAuthorizationRequest(await requestFromH3(event))

    if (!authRequest.user) {
      const natlk: ModuleOptions = useNatlkOptions().getOptions()
      sendRedirect(event, natlk.pages.login)
      return
    }
    // TODO:
    // After login, the user should be redirected back with user in the session.
    // You will need to manage the authorization query on the round trip.
    // The auth request object can be serialized and saved into a user's session.
    // Once the user has logged in set the user on the AuthorizationRequest

    // Once the user has approved or denied the client update the status
    // (true = approved, false = denied)
    authRequest.isAuthorizationApproved = true

    // If the user has not approved the client's authorization request,
    // the user should be redirected to the approval screen.
    if (!authRequest.isAuthorizationApproved) {
      sendRedirect(event, '/scopes')
      return
    }

    // At this point the user has approved the client for authorization.
    // Any last authorization requests such as Two Factor Authentication (2FA) can happen here.

    // Redirect back to redirect_uri with `code` and `state` as url query params.
    const oauthResponse = await oauth.completeAuthorizationRequest(authRequest)
    responseWithH3(event, oauthResponse)
    return h
  } catch (e) {
    handleErrorWithH3(event, e)
  }
})
