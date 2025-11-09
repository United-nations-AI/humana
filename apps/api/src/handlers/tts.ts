import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import OpenAI from 'openai';
import { z } from 'zod';

const schema = z.object({
  text: z.string().min(1),
  voice: z.string().optional(),
  format: z.enum(['mp3', 'wav', 'pcm']).optional(),
});

export async function ttsHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return { status: 503, jsonBody: { error: 'openai_not_configured' } };
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return {
        status: 400,
        jsonBody: { error: 'invalid_body', details: parsed.error.flatten() },
      };
    }

    const { text, voice, format } = parsed.data;

    const response = await openai.audio.speech.create({
      model: 'tts-1',
      input: text,
      voice: (voice || 'alloy') as any,
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      status: 200,
      body: buffer,
      headers: {
        'Content-Type': format === 'wav' ? 'audio/wav' : 'audio/mpeg',
      },
    };
  } catch (err: any) {
    context.error('TTS error:', err);
    return {
      status: 500,
      jsonBody: { error: 'tts_error', message: err?.message || 'unknown' },
    };
  }
}

