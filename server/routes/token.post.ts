import { useOAuthServer } from '../composables/oauth/use_oauth_server'
import { h3ReqToRequestInterface } from '../tools/converts'

export default defineEventHandler(async (event) => {
  try {
    const oauth = useOAuthServer()
    const req = await h3ReqToRequestInterface(event)
    const resp = await oauth.respondToAccessTokenRequest(req)
    return { data: resp.body }
  } catch (e) {
    console.log(e)
    return createError({ statusCode: 400, statusMessage: e.message })
  }
})
