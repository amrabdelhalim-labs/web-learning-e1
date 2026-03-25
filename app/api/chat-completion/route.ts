import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { validateApiKey, handleOpenAIError } from '@/app/lib/apiErrors';
import { OPENAI_MODEL } from '@/app/config';

export async function POST(request: Request) {
  const keyError = validateApiKey();
  if (keyError) return keyError;

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const req = await request.json();

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: req.messages,
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    return handleOpenAIError(error);
  }
}
