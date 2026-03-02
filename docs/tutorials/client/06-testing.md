# الدرس السادس: اختبارات العميل — Vitest + Testing Library 🧪

> **هدف الدرس:** فهم كيفية إعداد وكتابة اختبارات للمكونات والخطافات ودوال API باستخدام Vitest

---

## 1. لماذا نختبر كود العميل؟

تخيل الاختبارات مثل **فحص السيارة الدوري** — لا تذهب للفحص لأن السيارة معطلة، بل لتتأكد أنها تعمل بشكل صحيح وتكتشف المشاكل مبكرًا.

| بدون اختبارات | مع اختبارات |
|-------------|------------|
| تكتشف الأخطاء عند الاستخدام | تكتشف الأخطاء عند الكتابة ✅ |
| تعديل يكسر شيء آخر | التعديل محمي بالاختبارات ✅ |
| لا ثقة في الكود | ثقة عالية عند النشر ✅ |

---

## 2. إعداد بيئة الاختبار

### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()], // دعم JSX/TSX
  test: {
    globals: true,           // describe, it, expect بدون استيراد
    environment: 'jsdom',    // محاكاة المتصفح
    setupFiles: './app/__tests__/setupTests.ts',
    include: ['app/__tests__/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

| الإعداد | الغرض |
|---------|-------|
| `globals: true` | لا حاجة لاستيراد `describe`, `it` في كل ملف |
| `environment: 'jsdom'` | محاكاة DOM المتصفح في Node.js |
| `setupFiles` | ملف يُحمّل قبل كل الاختبارات |
| `alias @` | تفعيل المسارات المختصرة (`@/app/...`) |

### `setupTests.ts`

```typescript
import '@testing-library/jest-dom';

// محاكاة localStorage
const store: Record<string, string> = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  },
});

// محاكاة matchMedia (مطلوب لنظام المظهر)
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});
```

---

## 3. اختبار الثوابت (`config.test.ts`)

أبسط نوع اختبار — تحقق أن الثوابت لها القيم الصحيحة:

```typescript
import { LESSONS, LESSON_SECTIONS, getRandomLoadingText } from '@/app/config';

describe('قائمة الدروس (LESSONS)', () => {
  it('يجب أن تحتوي القائمة على 9 دروس', () => {
    expect(LESSONS).toHaveLength(9);
  });

  it('يجب أن تكون slugs فريدة', () => {
    const slugs = LESSONS.map((l) => l.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });
});

describe('getRandomLoadingText()', () => {
  it('يجب أن يعيد نصًا من القسم المحدد', () => {
    const text = getRandomLoadingText('home');
    expect(LOADING_TEXTS.home).toContain(text);
  });
});
```

---

## 4. اختبار الأنواع (`types.test.ts`)

نتحقق أن تعريفات TypeScript تعمل في وقت التشغيل:

```typescript
import type { ChatMessage, ApiResponse, ThemeMode } from '@/app/types';

describe('أنواع الرسائل (ChatMessage)', () => {
  it('يجب أن يقبل رسالة مستخدم', () => {
    const msg: ChatMessage = { role: 'user', content: 'مرحبًا' };
    expect(msg.role).toBe('user');
    expect(msg.content).toBe('مرحبًا');
  });
});

describe('وضع المظهر (ThemeMode)', () => {
  it('يجب أن يقبل القيمة dark', () => {
    const mode: ThemeMode = 'dark';
    expect(mode).toBe('dark');
  });
});
```

---

## 5. اختبار دوال API (`api.test.ts`)

نستخدم `vi.fn()` لمحاكاة `fetch`:

```typescript
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('getChatCompletion()', () => {
  it('يجب أن يرسل طلب POST مع الرسائل', async () => {
    // تحضير المحاكاة
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ role: 'assistant', content: 'مرحبًا' }),
    });

    // تنفيذ الدالة
    const messages = [{ role: 'user' as const, content: 'أهلاً' }];
    const result = await getChatCompletion(messages);

    // التحقق من الطلب
    expect(mockFetch).toHaveBeenCalledWith('/api/chat-completion', {
      method: 'POST',
      body: JSON.stringify({ messages }),
      headers: { 'Content-Type': 'application/json' },
    });

    // التحقق من النتيجة
    expect(result.status).toBe(200);
    expect(result.data.content).toBe('مرحبًا');
  });

  it('يجب أن يعيد 500 عند خطأ الشبكة', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await getChatCompletion([]);
    expect(result.status).toBe(500);
    expect(result.data.content).toBe('');
  });
});
```

التشبيه: `vi.fn()` مثل **ممثل بديل** — يقوم بدور `fetch` لكن بدون اتصال حقيقي بالانترنت.

---

## 6. اختبار الخطافات (`useThemeMode.test.tsx`)

نستخدم `renderHook` من Testing Library:

```typescript
import { renderHook } from '@testing-library/react';
import React from 'react';
import { ThemeContext } from '@/app/context/ThemeContext';
import { useThemeMode } from '@/app/hooks/useThemeMode';

describe('useThemeMode()', () => {
  const mockContext = { mode: 'light' as const, toggleTheme: () => {} };

  // تغليف الخطاف بالسياق المطلوب
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(ThemeContext.Provider, { value: mockContext }, children);

  it('يجب أن يعيد mode و toggleTheme', () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });

    expect(result.current.mode).toBe('light');
    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('يجب أن يرمي خطأ خارج Provider', () => {
    // بدون wrapper — لا يوجد Provider
    expect(() => {
      renderHook(() => useThemeMode());
    }).toThrow('useThemeMode must be used within a ThemeProviderWrapper');
  });
});
```

| دالة | الغرض |
|------|-------|
| `renderHook()` | تشغيل خطاف React في بيئة اختبار |
| `wrapper` | تغليف الخطاف بالسياق اللازم |
| `result.current` | القيمة الحالية للخطاف |
| `toThrow()` | التحقق من رمي خطأ |

---

## 7. تشغيل الاختبارات

```bash
# تشغيل جميع الاختبارات
npm test

# تشغيل مع المراقبة (إعادة التشغيل التلقائي)
npm run test:watch

# تشغيل مع تقرير التغطية
npm run test:coverage
```

### مثال على المخرجات:

```
✓ app/__tests__/config.test.ts     (18 tests)
✓ app/__tests__/types.test.ts      (14 tests)
✓ app/__tests__/api.test.ts        (8 tests)
✓ app/__tests__/apiErrors.test.ts  (8 tests)
✓ app/__tests__/useThemeMode.test.tsx  (3 tests)
✓ app/__tests__/useAppContext.test.tsx (4 tests)

Test Files  6 passed (6)
     Tests  55 passed (55)
```

---

## 8. خلاصة

| المفهوم | ما تعلمناه |
|---------|-----------|
| Vitest | إطار اختبار سريع متوافق مع Vite |
| jsdom | محاكاة بيئة المتصفح في Node.js |
| `vi.fn()` | إنشاء دوال محاكاة (mocks) |
| `vi.mock()` | استبدال وحدات برمجية كاملة |
| `renderHook()` | اختبار خطافات React بمعزل |
| `setupTests.ts` | إعداد مشترك لكل الاختبارات |
| أسماء عربية | `it('يجب أن...')` للمشاريع التعليمية |

---

*الدرس 6 من 6 — [← الصفحات الديناميكية](./05-dynamic-pages.md)*
