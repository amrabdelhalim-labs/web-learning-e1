import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActionCycle } from '@/app/hooks/useActionCycle';

describe('useActionCycle()', () => {
  it('keeps control visible but disables/enables by workflow stage', () => {
    const { result, rerender } = renderHook(({ hasInput }) => useActionCycle({ hasInput }), {
      initialProps: { hasInput: false },
    });

    expect(result.current.isActionDisabled).toBe(true);

    rerender({ hasInput: true });
    expect(result.current.isActionDisabled).toBe(false);

    act(() => {
      result.current.beginSubmit();
    });
    expect(result.current.isSubmitting).toBe(true);
    expect(result.current.isActionDisabled).toBe(true);

    act(() => {
      result.current.finishSubmit(true);
    });
    expect(result.current.isLocked).toBe(true);
    expect(result.current.isActionDisabled).toBe(true);

    act(() => {
      result.current.resetCycle();
    });
    expect(result.current.isLocked).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isActionDisabled).toBe(false);
  });

  it('keeps disabled when input is empty even after reset', () => {
    const { result, rerender } = renderHook(({ hasInput }) => useActionCycle({ hasInput }), {
      initialProps: { hasInput: true },
    });

    act(() => {
      result.current.beginSubmit();
      result.current.finishSubmit(true);
      result.current.resetCycle();
    });

    rerender({ hasInput: false });
    expect(result.current.isActionDisabled).toBe(true);
  });
});
