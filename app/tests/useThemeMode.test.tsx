import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { ThemeContext } from '@/app/context/ThemeContext';
import { useThemeMode } from '@/app/hooks/useThemeMode';
import type { ThemeContextState } from '@/app/types';

describe('useThemeMode()', () => {
  const mockThemeContext: ThemeContextState = {
    mode: 'light',
    toggleTheme: () => {},
  };

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(ThemeContext.Provider, { value: mockThemeContext }, children);

  it('يجب أن يعيد mode و toggleTheme من السياق', () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });

    expect(result.current.mode).toBe('light');
    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('يجب أن يعكس وضع المظهر المظلم', () => {
    const darkContext: ThemeContextState = {
      mode: 'dark',
      toggleTheme: () => {},
    };
    const darkWrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ThemeContext.Provider, { value: darkContext }, children);

    const { result } = renderHook(() => useThemeMode(), { wrapper: darkWrapper });
    expect(result.current.mode).toBe('dark');
  });

  it('يجب أن يرمي خطأ خارج ThemeProviderWrapper', () => {
    expect(() => {
      renderHook(() => useThemeMode());
    }).toThrow('useThemeMode must be used within a ThemeProviderWrapper');
  });
});
