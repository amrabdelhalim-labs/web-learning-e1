import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { validateApiKey, handleOpenAIError } from '@/app/lib/apiErrors';
import { OPENAI_MODEL } from '@/app/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const keyError = validateApiKey();
  if (keyError) return keyError;

  const req = await request.json();

  if (!req.message) {
    return NextResponse.json({ error: 'يجب إرسال message!' }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: req.message }],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      text: response.choices[0].message.content,
    });
  } catch (error) {
    return handleOpenAIError(error);
  }
}
