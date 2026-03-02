import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock NextResponse before importing
vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: Record<string, unknown>, init?: { status?: number }) => ({
      body,
      status: init?.status ?? 200,
    }),
  },
}));

// Import after mocking
const { handleOpenAIError, validateApiKey } = await import('@/app/lib/apiErrors');

describe('handleOpenAIError()', () => {
  it('يجب أن يعيد 401 عند خطأ مصادقة', () => {
    const error = { status: 401, message: 'Unauthorized' };
    const response = handleOpenAIError(error) as unknown as {
      body: { error: string };
      status: number;
    };

    expect(response.status).toBe(401);
    expect(response.body.error).toContain('API_KEY');
  });

  it('يجب أن يعيد 429 عند تجاوز حد الطلبات', () => {
    const error = { status: 429, message: 'Rate limited' };
    const response = handleOpenAIError(error) as unknown as {
      body: { error: string };
      status: number;
    };

    expect(response.status).toBe(429);
    expect(response.body.error).toContain('فترة زمنية');
  });

  it('يجب أن يعيد 500 لأي خطأ آخر', () => {
    const error = { status: 503, message: 'Service unavailable' };
    const response = handleOpenAIError(error) as unknown as {
      body: { error: string };
      status: number;
    };

    expect(response.status).toBe(500);
    expect(response.body.error).toContain('مشكلة في الخادم');
  });

  it('يجب أن يعيد 500 عند عدم وجود status', () => {
    const error = { message: 'Unknown error' };
    const response = handleOpenAIError(error) as unknown as {
      body: { error: string };
      status: number;
    };

    expect(response.status).toBe(500);
  });

  it('يجب أن يعيد رسائل خطأ بالعربية', () => {
    const errors = [{ status: 401 }, { status: 429 }, { status: 500 }];
    errors.forEach((error) => {
      const response = handleOpenAIError(error) as unknown as { body: { error: string } };
      // All Arabic text contains Arabic Unicode range
      expect(response.body.error).toMatch(/[\u0600-\u06FF]/);
    });
  });
});

describe('validateApiKey()', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  it('يجب أن يعيد null عند وجود المفتاح', () => {
    process.env.OPENAI_API_KEY = 'sk-test-key';
    const result = validateApiKey();
    expect(result).toBeNull();
  });

  it('يجب أن يعيد خطأ عند عدم وجود المفتاح', () => {
    delete process.env.OPENAI_API_KEY;
    const result = validateApiKey() as unknown as { body: { error: string }; status: number };

    expect(result).not.toBeNull();
    expect(result.status).toBe(500);
    expect(result.body.error).toContain('API_KEY');
  });

  it('يجب أن يعيد خطأ عندما يكون المفتاح فارغًا', () => {
    process.env.OPENAI_API_KEY = '';
    const result = validateApiKey() as unknown as { body: { error: string }; status: number };

    expect(result).not.toBeNull();
    expect(result.status).toBe(500);
  });
});
