import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { verifySupabaseJwt } from '@/lib/auth';

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
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'audio_file_required' },
        { status: 400 }
      );
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const file = new File([buffer], audioFile.name || 'audio.webm', { type: audioFile.type || 'audio/webm' });

    const transcription = await openai.audio.transcriptions.create({
      file: file as any,
      model: 'whisper-1',
    });

    return NextResponse.json({ text: (transcription as any).text || '' });
  } catch (err: any) {
    console.error('STT error:', err);
    return NextResponse.json(
      { error: 'whisper_error', message: err?.message || 'unknown' },
      { status: 500 }
    );
  }
}

