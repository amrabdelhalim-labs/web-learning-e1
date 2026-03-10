import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudioRecorder } from '@/app/hooks/useAudioRecorder';

describe('useAudioRecorder()', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('يجب أن يبدأ بحالة idle وبدون blob URL', () => {
    const { result } = renderHook(() => useAudioRecorder());
    expect(result.current.status).toBe('idle');
    expect(result.current.mediaBlobUrl).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('يجب أن يكتشف عدم دعم التسجيل عند غياب MediaRecorder', () => {
    const original = globalThis.MediaRecorder;
    // @ts-expect-error — testing undefined MediaRecorder
    delete globalThis.MediaRecorder;

    const { result } = renderHook(() => useAudioRecorder());
    // isSupported is set via useEffect; initially false, stays false without MediaRecorder
    expect(result.current.isSupported).toBe(false);

    globalThis.MediaRecorder = original;
  });

  it('يجب أن يعيد خطأ عند محاولة التسجيل بدون دعم', async () => {
    const original = globalThis.MediaRecorder;
    // @ts-expect-error — testing undefined MediaRecorder
    delete globalThis.MediaRecorder;

    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.error).toBe('التسجيل الصوتي غير مدعوم في هذا المتصفح');
    expect(result.current.status).toBe('idle');

    globalThis.MediaRecorder = original;
  });

  it('يجب أن يعيد error عند رفض إذن الميكروفون', async () => {
    // Mock MediaRecorder as supported
    const mockMediaRecorder = vi.fn();
    // @ts-expect-error — partial mock
    mockMediaRecorder.isTypeSupported = () => true;
    globalThis.MediaRecorder = mockMediaRecorder as unknown as typeof MediaRecorder;

    // Mock getUserMedia to reject with permission error
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn().mockRejectedValue(new Error('Permission denied by user')),
      },
      configurable: true,
    });

    const { result } = renderHook(() => useAudioRecorder());

    // Wait for useEffect to set isSupported
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.error).toBe('يرجى السماح بالوصول إلى الميكروفون');
    expect(result.current.status).toBe('idle');
  });

  it('يجب أن تمسح clearBlobUrl عنوان الـ blob', () => {
    const { result } = renderHook(() => useAudioRecorder());
    // Initially null, clearBlobUrl should keep it null and reset status
    act(() => {
      result.current.clearBlobUrl();
    });
    expect(result.current.mediaBlobUrl).toBeNull();
    expect(result.current.status).toBe('idle');
  });

  it('يجب أن تتوفر جميع الدوال المُعادة', () => {
    const { result } = renderHook(() => useAudioRecorder());
    expect(typeof result.current.startRecording).toBe('function');
    expect(typeof result.current.stopRecording).toBe('function');
    expect(typeof result.current.clearBlobUrl).toBe('function');
    expect(typeof result.current.isSupported).toBe('boolean');
  });
});
