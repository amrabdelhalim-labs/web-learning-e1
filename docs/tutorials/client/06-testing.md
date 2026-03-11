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
import { defineConfig } from 'vitest/config'; // استيراد أداة تعريف الإعدادات من Vitest
import react from '@vitejs/plugin-react';          // إضافة دعم React (JSX/TSX)
import path from 'path';                           // أداة Node.js للتعامل مع المسارات

export default defineConfig({
  plugins: [react()],                              // تفعيل إضافة React
  test: {
    globals: true,                                 // describe, it, expect متاحة بدون استيراد
    environment: 'jsdom',                          // محاكاة بيئة المتصفح (DOM) في Node.js
    setupFiles: './app/tests/setupTests.ts',       // ملف يُحمّل تلقائياً قبل كل اختبار
    include: ['app/tests/**/*.test.{ts,tsx}'],     // نمط أسماء ملفات الاختبار
    coverage: {
      provider: 'v8',                              // محرك جمع بيانات التغطية
      include: ['app/**/*.{ts,tsx}'],              // الملفات التي نريد قياس تغطيتها
      exclude: ['app/tests/**', 'app/layout.tsx', 'app/providers.tsx'], // استثناءات
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),           // تفعيل المسارات المختصرة (@/app/...)
    },
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
import '@testing-library/jest-dom'; // يُضيف أدوات DOM مثل toBeInTheDocument()

// محاكاة localStorage — jsdom لا يوفر localStorage كاملة
const store: Record<string, string> = {}; // كائن يعمل كمخزن بدلاً من localStorage الحقيقي
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key: string) => store[key] || null,          // جلب قيمة بالمفتاح
    setItem: (key: string, value: string) => { store[key] = value; }, // حفظ قيمة
    removeItem: (key: string) => { delete store[key]; },   // حذف مفتاح
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); }, // مسح الكل
  },
});

// محاكاة matchMedia — مطلوب لنظام المظهر (يكشف تفضيل المستخدم light/dark)
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation((query: string) => ({ // دالة محاكاة تعيد كائن matchMedia
    matches: false,               // لا يطابق أي media query افتراضياً
    media: query,                 // نص الاستعلام الممرّر
    addEventListener: vi.fn(),    // دالة فارغة (لا حاجة للأحداث في الاختبارات)
    removeEventListener: vi.fn(), // دالة فارغة لإزالة المستمعين
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
const mockFetch = vi.fn();            // إنشاء دالة محاكاة بديلة عن fetch الحقيقية
global.fetch = mockFetch;             // استبدال fetch العالمية بالمحاكاة

describe('getChatCompletion()', () => {
  it('يجب أن يرسل طلب POST مع الرسائل', async () => {
    // تحضير المحاكاة — نحدد ماذا ستعيد fetch عند استدعائها
    mockFetch.mockResolvedValueOnce({  // محاكاة استجابة ناجحة (مرة واحدة)
      status: 200,                     // كود الحالة
      json: () => Promise.resolve({ role: 'assistant', content: 'مرحبًا' }), // بيانات JSON
    });

    // تنفيذ الدالة المراد اختبارها
    const messages = [{ role: 'user' as const, content: 'أهلاً' }];
    const result = await getChatCompletion(messages);

    // التحقق أن fetch استُدعيت بالمعاملات الصحيحة
    expect(mockFetch).toHaveBeenCalledWith('/api/chat-completion', {
      method: 'POST',
      body: JSON.stringify({ messages }),
      headers: { 'Content-Type': 'application/json' },
    });

    // التحقق من النتيجة المُعادة
    expect(result.status).toBe(200);
    expect(result.data.content).toBe('مرحبًا');
  });

  it('يجب أن يعيد 500 عند خطأ الشبكة', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error')); // محاكاة فشل الشبكة

    const result = await getChatCompletion([]);                  // استدعاء الدالة
    expect(result.status).toBe(500);                             // التأكد من إرجاع 500
    expect(result.data.content).toBe('');                        // التأكد من محتوى فارغ
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

  // تغليف الخطاف بالسياق المطلوب — createElement بدلاً من JSX لأن الملف .ts وليس .tsx
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(ThemeContext.Provider, { value: mockContext }, children);

  it('يجب أن يعيد mode و toggleTheme', () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper }); // تشغيل الخطاف داخل Provider

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
npm test
# تشغيل جميع الاختبارات

# تشغيل مع المراقبة (إعادة التشغيل التلقائي)
npm run test:watch

# تشغيل مع تقرير التغطية
npm run test:coverage
```

### مثال على المخرجات:

```text
✓ app/tests/config.test.ts          (25 tests)
✓ app/tests/types.test.ts           (14 tests)
✓ app/tests/styles.test.ts          (19 tests)
✓ app/tests/api.test.ts             (8 tests)
✓ app/tests/apiErrors.test.ts       (8 tests)
✓ app/tests/useAudioRecorder.test.ts (6 tests)
✓ app/tests/useAppContext.test.tsx   (4 tests)
✓ app/tests/useThemeMode.test.tsx    (3 tests)

Test Files  8 passed (8)
     Tests  87 passed (87)
```

---

## 8. اختبار التنسيقات المركزية (`styles.test.ts`)

نتحقق أن ألوان الأقسام وأحجام الخطوط والأنماط المركزية تعمل بشكل صحيح:

```typescript
import { sectionColors, paperBase, fontSize } from '@/app/styles'; // استيراد التنسيقات المركزية

describe('ألوان الأقسام (sectionColors)', () => {
  it('يجب أن يعيد ألوان الإجابات الصحيحة للوضعين', () => {
    expect(sectionColors.answer.bg('dark')).toBe('#1b5e20');  // خلفية خضراء داكنة
    expect(sectionColors.answer.bg('light')).toBe('#e8f5e9'); // خلفية خضراء فاتحة
  });
});

describe('مقياس الخطوط (fontSize)', () => {
  it('يجب أن يحتوي pageTitle على قيم متجاوبة', () => {
    // fontSize.pageTitle يتغير حسب حجم الشاشة
    expect(fontSize.pageTitle).toEqual({ xs: '1.25rem', sm: '1.375rem' });
  });

  it('يجب أن تكون جميع القيم بوحدة rem', () => {
    // rem أفضل من px لأنها تحترم إعدادات المستخدم لحجم الخط
    expect(fontSize.body).toMatch(/rem$/);
  });
});

describe('أنماط Paper المركزية', () => {
  it('يجب أن يحتوي paperBase على padding متجاوب', () => {
    // padding متجاوب: 12px على الهواتف, 20px على الشاشات الكبيرة
    expect(paperBase).toHaveProperty('p');
    expect((paperBase as Record<string, unknown>).p).toEqual({ xs: 1.5, sm: 2.5 });
  });
});
```

---

## 9. اختبار خطاف التسجيل الصوتي (`useAudioRecorder.test.ts`)

خطاف تسجيل الصوت يعمل عبر MediaRecorder API — نتحقق من سلوكه في حالات مختلفة:

```typescript
import { renderHook, act } from '@testing-library/react'; // أدوات اختبار الخطافات
import { useAudioRecorder } from '@/app/hooks/useAudioRecorder'; // الخطاف المراد اختباره

describe('useAudioRecorder()', () => {
  it('يجب أن يبدأ بحالة idle', () => {
    const { result } = renderHook(() => useAudioRecorder()); // تشغيل الخطاف
    expect(result.current.status).toBe('idle');               // الحالة الابتدائية
    expect(result.current.mediaBlobUrl).toBeNull();           // لا يوجد تسجيل بعد
    expect(result.current.error).toBeNull();                  // لا يوجد خطأ
  });

  it('يجب أن يكتشف عدم الدعم عند غياب MediaRecorder', () => {
    const original = globalThis.MediaRecorder; // حفظ النسخة الأصلية
    delete globalThis.MediaRecorder;           // إزالة MediaRecorder لمحاكاة متصفح قديم

    const { result } = renderHook(() => useAudioRecorder());
    expect(result.current.isSupported).toBe(false); // غير مدعوم

    globalThis.MediaRecorder = original; // استعادة MediaRecorder
  });

  it('يجب أن يعيد خطأ عند رفض إذن الميكروفون', async () => {
    // محاكاة رفض المستخدم لإذن الميكروفون
    navigator.mediaDevices.getUserMedia = vi.fn()
      .mockRejectedValue(new Error('Permission denied'));

    const { result } = renderHook(() => useAudioRecorder());
    await act(async () => { await result.current.startRecording(); });

    expect(result.current.error).toContain('السماح'); // رسالة خطأ عربية
  });
});
```

| الحالة المختبرة | لماذا نختبرها |
|----------------|---------------|
| الحالة الابتدائية | التأكد أن الخطاف يبدأ نظيفاً |
| غياب MediaRecorder | متصفحات قديمة لا تدعم التسجيل |
| رفض الإذن | المستخدم يرفض صلاحية الميكروفون |
| عدم الدعم | أجهزة بدون ميكروفون |

---

## 10. خلاصة

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
