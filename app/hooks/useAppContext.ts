'use client';

import { useContext } from 'react';
import { AppContext } from '@/app/context/AppContext';
import type { AppContextState } from '@/app/types';

/**
 * Hook for accessing the app context.
 * Throws if used outside AppProvider.
 */
export function useAppContext(): AppContextState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
