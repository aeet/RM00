import { ErrorType, OAuthException, OAuthRequest, OAuthResponse } from '@jmondi/oauth2-server'
import type { H3Event } from 'h3'

export function responseFromH3(event: H3Event): OAuthResponse {
  return new OAuthResponse({
    status: getResponseStatus(event),
    headers: getResponseHeaders(event)
  })
}

export function responseWithH3(event: H3Event, oauthResponse: OAuthResponse): void {
  if (oauthResponse.status === 302) {
    if (typeof oauthResponse.headers.location !== 'string' || oauthResponse.headers.location === '') {
      throw new OAuthException(`missing redirect location`, ErrorType.InvalidRequest)
    }
    event.respondWith(
      new Response(null, {
        status: 302,
        headers: {
          Location: oauthResponse.headers.location
        }
      })
    )
  }

  event.respondWith(
    new Response(JSON.stringify(oauthResponse.body), {
      status: oauthResponse.status,
      headers: oauthResponse.headers
    })
  )
}

export async function requestFromH3(event: H3Event, updatedBody?: Record<string, any>): Promise<OAuthRequest> {
  let query: Record<string, any> = {}
  let body: Record<string, any> = {}
  if (['GET', 'DELETE', 'HEAD', 'OPTIONS'].includes(event.method.toUpperCase())) {
    query = getQuery(event) as Record<string, any>
  }
  if (['POST', 'PUT', 'PATCH'].includes(event.method.toUpperCase())) {
    if (updatedBody) {
      body = updatedBody
    } else {
      body = await readBody(event)
    }
  }
  return new OAuthRequest({
    query: query,
    body: body,
    headers: getHeaders(event) ?? {}
  })
}

export function handleErrorWithH3(event: H3Event, e: unknown | OAuthException): void {
  if (isOAuthError(e)) {
    sendError(event, e)
    return
  }
  throw e
}

export function isOAuthError(error: unknown): error is OAuthException {
  if (!error) return false
  if (typeof error !== 'object') return false
  return 'oauth' in error
}
