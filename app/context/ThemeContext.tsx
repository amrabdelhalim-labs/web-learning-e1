'use client';

import { createContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import CssBaseline from '@mui/material/CssBaseline';
import type { ThemeMode, ThemeContextState } from '@/app/types';
import { THEME_STORAGE_KEY } from '@/app/config';

export const ThemeContext = createContext<ThemeContextState | null>(null);

/** RTL cache for Emotion (MUI RTL support) */
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

/** Create MUI theme by mode */
function createAppTheme(mode: ThemeMode) {
  return createTheme({
    direction: 'rtl',
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: { main: '#1565c0', light: '#1976d2', dark: '#0d47a1' },
            secondary: { main: '#7c4dff' },
            background: {
              default: '#f8f9fa',
              paper: '#ffffff',
            },
            text: {
              primary: '#1a1a2e',
              secondary: '#546e7a',
            },
          }
        : {
            primary: { main: '#90caf9', light: '#bbdefb', dark: '#42a5f5' },
            secondary: { main: '#b388ff' },
            background: {
              default: '#0a1929',
              paper: '#132f4c',
            },
            text: {
              primary: '#e3f2fd',
              secondary: '#b0bec5',
            },
          }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
      h6: { fontWeight: 700 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderLeft: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProviderWrapper({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  // تحميل التفضيل المحفوظ أو استخدام تفضيل النظام
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark') {
      setMode(stored);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(systemPrefersDark ? 'dark' : 'light');
    }
    setMounted(true);
  }, []);

  // حفظ التفضيل عند التغيير
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
      document.documentElement.setAttribute('data-theme', mode);
    }
  }, [mode, mounted]);

  // الاستماع لتغييرات تفضيل النظام
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (!stored) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const contextValue = useMemo<ThemeContextState>(
    () => ({ mode, toggleTheme }),
    [mode, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <CacheProvider value={rtlCache}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </CacheProvider>
    </ThemeContext.Provider>
  );
}
