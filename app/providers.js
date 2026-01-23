"use client";
import { createTheme } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { ThemeProvider } from '@mui/material/styles';
import { AppProvider } from '@/app/context/AppContext';

const theme = createTheme({
  direction: 'rtl',
});

const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function Providers({ children }) {
  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <AppProvider>
          {children}
        </AppProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};
