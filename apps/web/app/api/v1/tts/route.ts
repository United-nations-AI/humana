import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { verifySupabaseJwt } from '@/lib/auth';

const schema = z.object({
  text: z.string().min(1),
  voice: z.string().optional(),
  format: z.enum(['mp3', 'wav', 'pcm']).optional(),
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

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'openai_not_configured' },
        { status: 503 }
      );
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'invalid_body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { text, voice, format } = parsed.data;

    const response = await openai.audio.speech.create({
      model: 'tts-1',
      input: text,
      voice: (voice || 'alloy') as any,
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': format === 'wav' ? 'audio/wav' : 'audio/mpeg',
      },
    });
  } catch (err: any) {
    console.error('TTS error:', err);
    return NextResponse.json(
      { error: 'tts_error', message: err?.message || 'unknown' },
      { status: 500 }
    );
  }
}

