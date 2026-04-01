# الدرس الثاني: نظام المظهر — الوضع المظلم والفاتح 🌓

> **هدف الدرس:** فهم كيفية بناء نظام مظهر كامل يدعم الوضع المظلم والفاتح مع حفظ الخيار واكتشاف تفضيل النظام
>
> **ملاحظة تحديث:** راجع `app/context/ThemeContext.tsx` كمرجع تنفيذي نهائي، وهذا الدرس يشرح المفهوم.

---

## 1. لماذا نحتاج نظام مظهر؟

تخيل أن نظام المظهر مثل **مفتاح الإضاءة** في غرفة — يمكنك التبديل بين ضوء دافئ (فاتح) وضوء خافت (مظلم) حسب راحتك، والنظام يتذكر اختيارك في كل مرة تعود.

| الميزة | الشرح |
|--------|-------|
| الوضع المظلم | مريح للعينين في الإضاءة المنخفضة |
| الوضع الفاتح | واضح في الإضاءة العالية |
| اكتشاف النظام | يستخدم تفضيل المستخدم من إعدادات الجهاز |
| الحفظ المحلي | يتذكر الخيار عند إعادة فتح التطبيق |

---

## 2. بنية نظام المظهر

```text
app/
├── context/
│   └── ThemeContext.tsx  // قلب النظام (سياق + مزود + ألوان)
├── hooks/
│   └── useThemeMode.ts  // خطاف مخصص للوصول السهل
├── config.ts               ← THEME_STORAGE_KEY
└── types.ts                ← ThemeMode, ThemeContextState
```

### التسلسل:

```text
ThemeContext.tsx
    │
    ├── createAppTheme('light')  // ألوان فاتحة
    ├── createAppTheme('dark')  // ألوان مظلمة
    ├── RTL Cache  // دعم الاتجاه العربي
    ├── localStorage  // حفظ الخيار
    └── matchMedia  // اكتشاف تفضيل النظام
```

---

## 3. إنشاء الألوان (`createAppTheme`)

نستخدم `createTheme()` من MUI لتعريف لوحتي ألوان:

```typescript
import { createTheme } from '@mui/material/styles';
import type { ThemeMode } from '@/app/types';

function createAppTheme(mode: ThemeMode) {
  return createTheme({
    direction: 'rtl', // الاتجاه من اليمين لليسار
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1565c0' : '#90caf9',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Tajawal", "Roboto", sans-serif',
    },
  });
}
```

| الخاصية | الوضع الفاتح | الوضع المظلم |
|---------|-------------|-------------|
| اللون الأساسي | `#1565c0` (أزرق داكن) | `#90caf9` (أزرق فاتح) |
| خلفية الصفحة | `#f5f5f5` (رمادي فاتح) | `#121212` (أسود تقريبًا) |
| خلفية البطاقات | `#ffffff` (أبيض) | `#1e1e1e` (رمادي داكن) |

---

## 4. سياق المظهر (`ThemeContext`)

هذا هو قلب النظام — يدير الحالة ويوفرها لكل المكونات:

```typescript
import { createContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { THEME_STORAGE_KEY } from '@/app/config';

// إنشاء السياق
export const ThemeContext = createContext<ThemeContextState | null>(null);

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  // الحالة: الوضع الحالي (light أو dark)
  const [mode, setMode] = useState<ThemeMode>('light');

  // عند تحميل الصفحة: اقرأ الخيار المحفوظ
  useEffect(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      setMode(saved);
    } else {
      // لا خيار محفوظ — استخدم تفضيل النظام
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // دالة التبديل
  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  };

  // إنشاء كائن المظهر (يُعاد حسابه عند تغيير mode)
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />   {/* يُطبّق الألوان الأساسية على body */}
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
```

### مخطط التدفق:

```text
فتح التطبيق
    │
    ├── هل يوجد خيار في localStorage؟
    │   ├── نعم  // استخدمه
    │   └── لا  // اكتشف تفضيل النظام
    │
    ▼
المستخدم يضغط زر التبديل
    │
    ├── تغيير الحالة (light ↔ dark)
    ├── حفظ في localStorage
    └── إعادة حساب المظهر (useMemo)
```

---

## 5. دعم RTL (الاتجاه من اليمين لليسار)

MUI لا يدعم RTL تلقائيًا — نحتاج إعداده يدويًا:

```typescript
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';

// إنشاء ذاكرة مؤقتة تدعم RTL
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// في ThemeProviderWrapper:
return (
  <CacheProvider value={rtlCache}>
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  </CacheProvider>
);
```

| المكتبة | الدور |
|---------|-------|
| `@emotion/cache` | إنشاء ذاكرة مؤقتة لأنماط CSS |
| `stylis` | معالج CSS في Emotion |
| `@mui/stylis-plugin-rtl` | إضافة تحوّل CSS من LTR إلى RTL |

التشبيه: RTL Plugin مثل **مرآة** — يعكس كل `margin-left` إلى `margin-right` تلقائيًا.

---

## 6. الخطاف المخصص (`useThemeMode`)

بدلاً من تكرار `useContext(ThemeContext)` في كل مكون:

```typescript
'use client';

import { useContext } from 'react';
import { ThemeContext } from '@/app/context/ThemeContext';

export function useThemeMode(): ThemeContextState {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProviderWrapper');
  }
  return context;
}
```

### الاستخدام في المكونات:

```typescript
import { useThemeMode } from '@/app/hooks/useThemeMode';
// في أي مكون:

function ToolBar() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <IconButton onClick={toggleTheme}>
      {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
}
```

---

## 7. الاستماع لتغييرات النظام

إذا غيّر المستخدم إعدادات نظامه (من الفاتح للمظلم)، يتغير التطبيق تلقائيًا:

```typescript
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent) => {
    // فقط إذا لم يكن هناك خيار محفوظ
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      setMode(e.matches ? 'dark' : 'light');
    }
  };

  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);
```

---

## 8. خلاصة

| المفهوم | ما تعلمناه |
|---------|-----------|
| `createTheme()` | إنشاء لوحة ألوان MUI مع light/dark |
| `ThemeContext` | سياق React لتمرير mode و toggleTheme |
| `localStorage` | حفظ خيار المستخدم بين الزيارات |
| `matchMedia` | اكتشاف تفضيل النظام (dark/light) |
| RTL Cache | دعم الاتجاه العربي في MUI عبر stylis plugin |
| `useThemeMode` | خطاف مخصص للوصول السهل مع حماية من الاستخدام الخاطئ |
| `useMemo` | تحسين الأداء — لا يعيد إنشاء المظهر بدون تغيير |

---

*الدرس 2 من 6 — [← هيكل التطبيق](./01-app-structure.md) | [إدارة الحالة →](./03-state-management.md)*
