'use client';

import { ThemeProviderWrapper } from '@/app/context/ThemeContext';
import { AppProvider } from '@/app/context/AppContext';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProviderWrapper>
      <AppProvider>{children}</AppProvider>
    </ThemeProviderWrapper>
  );
}
