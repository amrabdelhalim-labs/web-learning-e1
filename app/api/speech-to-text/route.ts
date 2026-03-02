import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { validateApiKey, handleOpenAIError } from '@/app/lib/apiErrors';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const keyError = validateApiKey();
  if (keyError) return keyError;

  try {
    const formData = await request.formData();
    const audioFile = formData.get('file') as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: 'يجب إرسال ملف صوتي!' }, { status: 400 });
    }

    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      response_format: 'json',
    });

    return NextResponse.json(response);
  } catch (error) {
    return handleOpenAIError(error);
  }
}
