import type { RequestInterface } from '@jmondi/oauth2-server'
import type { H3Event } from 'h3'
import { getQuery, readBody } from 'h3'

export const h3ReqToRequestInterface = async (event: H3Event): Promise<RequestInterface> => {
  const headers = event.node.req.headers
  const method = event.node.req.method
  let query: Record<string, any> = {}
  let body: Record<string, any> = {}
  if (['GET', 'DELETE', 'HEAD', 'OPTIONS'].includes(method)) {
    query = getQuery(event) as Record<string, any>
  }
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    body = await readBody(event) as Record<string, any>
  }
  return {
    headers: headers as Record<string, string | string[]>,
    query: query,
    body: body
  }
}
