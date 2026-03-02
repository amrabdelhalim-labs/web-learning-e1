import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getChatCompletion, getTranscription, getTextCompletion } from '@/app/lib/api';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
});

describe('getChatCompletion()', () => {
  it('يجب أن يرسل طلب POST مع الرسائل', async () => {
    const mockData = { role: 'assistant', content: 'مرحبًا' };
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(mockData),
    });

    const messages = [{ role: 'user' as const, content: 'أهلاً' }];
    const result = await getChatCompletion(messages);

    expect(mockFetch).toHaveBeenCalledWith('/api/chat-completion', {
      method: 'POST',
      body: JSON.stringify({ messages }),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockData);
  });

  it('يجب أن يعيد status 500 عند حدوث خطأ في الشبكة', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await getChatCompletion([]);

    expect(result.status).toBe(500);
    expect(result.data.role).toBe('assistant');
    expect(result.data.content).toBe('');
  });

  it('يجب أن يعيد الحالة الصحيحة عند خطأ 401', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 401,
      json: () => Promise.resolve({ error: 'Unauthorized' }),
    });

    const result = await getChatCompletion([{ role: 'user', content: 'test' }]);

    expect(result.status).toBe(401);
  });
});

describe('getTranscription()', () => {
  it('يجب أن يرسل FormData مع الملف الصوتي', async () => {
    const mockBlob = new Blob(['audio'], { type: 'audio/webm' });
    const mockBlobUrl = URL.createObjectURL(mockBlob);
    const mockData = { text: 'Hello world' };

    // Mock the blob fetch
    mockFetch
      .mockResolvedValueOnce({
        blob: () => Promise.resolve(mockBlob),
      })
      .mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve(mockData),
      });

    const result = await getTranscription(mockBlobUrl);

    expect(result.status).toBe(200);
    expect(result.data.text).toBe('Hello world');

    // الاستدعاء الثاني هو إرسال FormData
    expect(mockFetch).toHaveBeenCalledTimes(2);
    const secondCall = mockFetch.mock.calls[1];
    expect(secondCall[0]).toBe('/api/speech-to-text');
    expect(secondCall[1].method).toBe('POST');

    URL.revokeObjectURL(mockBlobUrl);
  });

  it('يجب أن يعيد status 500 عند حدوث خطأ', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await getTranscription('blob:invalid');

    expect(result.status).toBe(500);
    expect(result.data.text).toBe('');
  });
});

describe('getTextCompletion()', () => {
  it('يجب أن يرسل طلب POST مع النص', async () => {
    const mockData = { text: 'Generated response' };
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(mockData),
    });

    const result = await getTextCompletion('Translate this');

    expect(mockFetch).toHaveBeenCalledWith('/api/text-completion', {
      method: 'POST',
      body: JSON.stringify({ message: 'Translate this' }),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(result.status).toBe(200);
    expect(result.data.text).toBe('Generated response');
  });

  it('يجب أن يعيد status 500 عند حدوث خطأ في الشبكة', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await getTextCompletion('test');

    expect(result.status).toBe(500);
    expect(result.data.text).toBe('');
  });

  it('يجب أن يعيد الحالة الصحيحة عند خطأ 429', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 429,
      json: () => Promise.resolve({ error: 'Rate limited' }),
    });

    const result = await getTextCompletion('test');

    expect(result.status).toBe(429);
  });
});
