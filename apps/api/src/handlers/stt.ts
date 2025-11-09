import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import OpenAI from 'openai';

export async function sttHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return { status: 503, jsonBody: { error: 'openai_not_configured' } };
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | Express.Multer.File | null;

    if (!audioFile) {
      return { status: 400, jsonBody: { error: 'audio_file_required' } };
    }

    let buffer: Buffer;
    let filename: string;
    let mimeType: string;

    if ('buffer' in audioFile) {
      // Multer file
      buffer = Buffer.from(audioFile.buffer);
      filename = audioFile.originalname || 'audio.webm';
      mimeType = audioFile.mimetype || 'audio/webm';
    } else {
      // File object from FormData
      const arrayBuffer = await audioFile.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      filename = audioFile.name || 'audio.webm';
      mimeType = audioFile.type || 'audio/webm';
    }

    const file = new File([buffer], filename, { type: mimeType });
    const transcription = await openai.audio.transcriptions.create({
      file: file as any,
      model: 'whisper-1',
    });

    return { jsonBody: { text: (transcription as any).text || '' } };
  } catch (err: any) {
    context.error('STT error:', err);
    return {
      status: 500,
      jsonBody: { error: 'whisper_error', message: err?.message || 'unknown' },
    };
  }
}

