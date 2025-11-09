import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

export async function healthHandler(
  _request: HttpRequest,
  _context: InvocationContext
): Promise<HttpResponseInit> {
  return { jsonBody: { ok: true } };
}

