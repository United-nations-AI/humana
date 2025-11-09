import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { z } from 'zod';
import { chatComplete, getEmbedding } from '../lib/mistral';
import { retrieveRagContext } from '../lib/rag';

const schema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })).min(1),
  language: z.string().optional(),
});

export async function chatHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return {
        status: 400,
        jsonBody: { error: 'invalid_body', details: parsed.error.flatten() },
      };
    }

    const { messages, language } = parsed.data;
    const mistralApiKey = process.env.MISTRAL_API_KEY;
    if (!mistralApiKey) {
      return { status: 503, jsonBody: { error: 'mistral_not_configured' } };
    }

    const userMessage = messages[messages.length - 1]?.content || '';
    const ragContext = await retrieveRagContext(userMessage);

    const systemPrompt = `You are Humana, a helpful human rights assistant. 
Reply in ${language || 'the user\'s language'}. Keep responses clear and actionable.
${ragContext ? `\n\nRelevant legal context:\n${ragContext}` : ''}`;

    const response = await chatComplete(
      [
        { role: 'system', content: systemPrompt },
        ...messages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
      ],
      {
        model: 'mistral-small-latest',
        temperature: 0.3,
        maxTokens: 1000,
      }
    );

    const reply = response.choices[0]?.message?.content || '';
    return { jsonBody: { reply } };
  } catch (err: any) {
    context.error('Chat error:', err);
    return {
      status: 500,
      jsonBody: { error: 'chat_error', message: err?.message || 'unknown' },
    };
  }
}
