import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { verifySupabaseJwt } from '@/lib/auth';

const schema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })).min(1),
  language: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authError = await verifySupabaseJwt(request);
    if (authError) {
      return NextResponse.json(
        { error: authError.error, message: authError.message },
        { status: authError.status }
      );
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'invalid_body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { messages, language } = parsed.data;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'openai_not_configured' },
        { status: 503 }
      );
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

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

    const systemPrompt = `You are Humana, a helpful human rights assistant from the AIHRP (Artificial Intelligence for Human Rights Advocacy and Analysis Program) platform. 
Reply in ${languageName}. Keep responses clear and actionable.
Focus on providing accurate information about human rights, protections, and resources.
When a user shares a document or file content, carefully analyze it and provide relevant insights, summaries, or answers to their questions based on the document content.`;

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
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('Chat error:', err);
    return NextResponse.json(
      { error: 'chat_error', message: err?.message || 'unknown' },
      { status: 500 }
    );
  }
}

