import type { HttpRequest, HttpResponseInit } from '@azure/functions';
import jwt from 'jsonwebtoken';

export async function verifySupabaseJwt(request: HttpRequest | any): Promise<HttpResponseInit | null> {
  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) return null;

  const authHeader = request.headers?.get ? request.headers.get('authorization') : request.headers?.authorization;
  const auth = authHeader || '';
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : undefined;
  if (!token) {
    return { status: 401, jsonBody: { error: 'missing_bearer_token' } };
  }
  try {
    const payload = jwt.verify(token, secret);
    (request as any).user = payload;
    return null;
  } catch (err: any) {
    return { status: 401, jsonBody: { error: 'invalid_token' } };
  }
}
