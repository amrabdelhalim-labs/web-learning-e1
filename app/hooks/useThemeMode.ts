'use client';

import { useContext } from 'react';
import { ThemeContext } from '@/app/context/ThemeContext';
import type { ThemeContextState } from '@/app/types';

/**
 * Hook for accessing theme mode and toggle function.
 * Throws if used outside ThemeProviderWrapper.
 */
export function useThemeMode(): ThemeContextState {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProviderWrapper');
  }
  return context;
}
