import { NextResponse } from 'next/server';

/**
 * Centralized error handler for OpenAI API route errors.
 * Returns appropriate Arabic error messages based on error status codes.
 */
export function handleOpenAIError(error: unknown): NextResponse {
  const apiError = error as { status?: number; message?: string };

  if (apiError.status === 401) {
    return NextResponse.json(
      {
        error: 'يرجى التأكد من إضافتك ال API_KEY الخاص بك ومن صلاحيته!',
      },
      { status: 401 }
    );
  }

  if (apiError.status === 429) {
    return NextResponse.json(
      {
        error:
          'حدث خطأ في الاستجابة من الخادم بسبب أنك قمت بأكثر من طلب خلال فترة زمنية قصيرة، يرجى الانتظار قليلًا ومن ثم المحاولة مرة أخرى!',
      },
      { status: 429 }
    );
  }

  console.error(`Error with OpenAI API request: ${apiError.message}`);

  return NextResponse.json(
    { error: 'هنالك مشكلة في الخادم، نرجو المحاولة لاحقًا!' },
    { status: 500 }
  );
}

/**
 * Returns an error response if OPENAI_API_KEY is not configured.
 * Returns null if the key exists.
 */
export function validateApiKey(): NextResponse | null {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error: 'يرجى التأكد من إضافتك ال API_KEY الخاص بك ومن صلاحيته!',
      },
      { status: 500 }
    );
  }
  return null;
}
