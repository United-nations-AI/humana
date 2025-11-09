import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { z } from 'zod';
import { getEmbedding } from '../lib/mistral';
import { storeDocument } from '../lib/rag';

const schema = z.object({
  content: z.string().min(1),
  metadata: z.object({
    id: z.string(),
    title: z.string().optional(),
    source: z.string().optional(),
    category: z.string().optional(),
  }),
});

export async function adminRagUploadHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = (request as any).user;
    if (!user || user.role !== 'admin') {
      return { status: 403, jsonBody: { error: 'forbidden_admin_only' } };
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return {
        status: 400,
        jsonBody: { error: 'invalid_body', details: parsed.error.flatten() },
      };
    }

    const { content, metadata } = parsed.data;
    const mistralApiKey = process.env.MISTRAL_API_KEY;
    if (!mistralApiKey) {
      return { status: 503, jsonBody: { error: 'mistral_not_configured' } };
    }

    const embedding = await getEmbedding(content);
    if (!embedding) {
      return { status: 500, jsonBody: { error: 'embedding_failed' } };
    }

    await storeDocument(content, metadata, embedding);

    return { jsonBody: { success: true, message: 'Document stored' } };
  } catch (err: any) {
    context.error('RAG upload error:', err);
    return {
      status: 500,
      jsonBody: { error: 'upload_error', message: err?.message || 'unknown' },
    };
  }
}
