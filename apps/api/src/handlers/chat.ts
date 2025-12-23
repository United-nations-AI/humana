import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { z } from 'zod';
import OpenAI from 'openai';

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
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return { status: 503, jsonBody: { error: 'openai_not_configured' } };
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Map language codes to language names
    const languageMap: Record<string, string> = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'ar': 'Arabic',
      'ru': 'Russian',
      'it': 'Italian',
      'ml': 'Malayalam',
      'hi': 'Hindi',
      'sw': 'Swahili',
    };
    const languageName = language ? (languageMap[language] || language) : 'the user\'s language';

    const systemPrompt = `You are Humana, a helpful human rights assistant. 
Reply in ${languageName}. Keep responses clear and actionable.
Focus on providing accurate information about human rights, protections, and resources.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const reply = completion.choices[0]?.message?.content || '';
    return { jsonBody: { reply } };
  } catch (err: any) {
    context.error('Chat error:', err);
    return {
      status: 500,
      jsonBody: { error: 'chat_error', message: err?.message || 'unknown' },
    };
  }
}
