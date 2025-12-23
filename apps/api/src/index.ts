import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import dotenv from 'dotenv';
import { verifySupabaseJwt } from './auth';
import { chatHandler } from './handlers/chat';
import { sttHandler } from './handlers/stt';
import { ttsHandler } from './handlers/tts';
import { healthHandler } from './handlers/health';

dotenv.config();

app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: healthHandler,
});
console.log('chat');
app.http('chat', {
  methods: ['POST'],
  authLevel: 'function',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const authResult = await verifySupabaseJwt(request);
    if (authResult) return authResult;
    return chatHandler(request, context);
  },
});

app.http('stt', {
  methods: ['POST'],
  authLevel: 'function',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const authResult = await verifySupabaseJwt(request);
    if (authResult) return authResult;
    return sttHandler(request, context);
  },
});

app.http('tts', {
  methods: ['POST'],
  authLevel: 'function',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const authResult = await verifySupabaseJwt(request);
    if (authResult) return authResult;
    return ttsHandler(request, context);
  },
});
