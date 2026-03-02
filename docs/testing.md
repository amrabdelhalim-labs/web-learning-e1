# دليل الاختبارات — علمني 🧪

> توثيق شامل لاختبارات مشروع **علمني** (Teach Me) — إطار الاختبار، الملفات، الأوامر، والتغطية

---

## 📊 نظرة عامة

| العنصر | القيمة |
|--------|--------|
| **إطار الاختبار** | Vitest 4.x |
| **بيئة الاختبار** | jsdom |
| **مكتبة الاختبار** | @testing-library/react |
| **إجمالي الاختبارات** | 55 اختبار |
| **ملفات الاختبار** | 6 ملفات |
| **نسبة النجاح** | 100% |

---

## 📁 بنية ملفات الاختبار

```
app/__tests__/
├── setupTests.ts           ← إعداد بيئة الاختبار (localStorage, matchMedia)
├── config.test.ts          ← اختبار الثوابت والإعدادات (18 اختبار)
├── types.test.ts           ← اختبار بنية الأنواع (14 اختبار)
├── api.test.ts             ← اختبار دوال API العميل (8 اختبار)
├── apiErrors.test.ts       ← اختبار معالجة الأخطاء في الخادم (8 اختبار)
├── useThemeMode.test.tsx   ← اختبار خطاف المظهر (3 اختبار)
└── useAppContext.test.tsx  ← اختبار خطاف سياق التطبيق (4 اختبار)
```

---

## 🚀 أوامر التشغيل

```bash
# تشغيل جميع الاختبارات
npm test

# تشغيل مع المراقبة (إعادة التشغيل عند التعديل)
npm run test:watch

# تشغيل مع تقرير التغطية
npm run test:coverage
```

---

## 📋 تفاصيل كل ملف اختبار

### 1. `setupTests.ts` — إعداد البيئة

يُحمَّل تلقائيًا قبل كل ملف اختبار. يوفر:

- **localStorage mock** — محاكاة التخزين المحلي (مطلوب لنظام المظهر)
- **matchMedia mock** — محاكاة استعلامات الوسائط (مطلوب لكشف تفضيل النظام dark/light)
- **@testing-library/jest-dom** — matchers إضافية مثل `toBeInTheDocument()`

### 2. `config.test.ts` — ثوابت التطبيق (18 اختبار)

| المجموعة | عدد الاختبارات | ما تختبره |
|----------|----------------|-----------|
| ثوابت التطبيق | 6 | `APP_NAME`, `APP_NAME_EN`, `DRAWER_WIDTH`, `MAX_CONTENT_WIDTH`, `THEME_STORAGE_KEY`, `OPENAI_MODEL` |
| قائمة الدروس | 4 | عدد الدروس (9)، وجود `slug` و `nameAr`، تفرد slugs، عدم وجود مسافات |
| أقسام الدروس | 3 | عدد الأقسام (4)، الأقسام المطلوبة، أسماء بالعربية |
| نصوص التحميل | 2 | تغطية جميع الأقسام، عدم وجود نصوص فارغة |
| `getRandomLoadingText()` | 3 | إعادة نص صحيح، تغطية كل قسم، اختبار العشوائية |

### 3. `types.test.ts` — بنية الأنواع (14 اختبار)

يختبر أن جميع تعريفات TypeScript تعمل بشكل صحيح في وقت التشغيل:

| المجموعة | عدد الاختبارات | ما تختبره |
|----------|----------------|-----------|
| `ChatMessage` | 3 | رسالة مستخدم، مساعد، نظام |
| `ApiResponse` | 4 | مع `ChatCompletionData`، `TextCompletionData`، `TranscriptionData`، `ApiErrorData` |
| `ThemeMode` | 2 | القيمتان `light` و `dark` |
| `LessonItem` | 1 | بنية الدرس (`slug` + `nameAr`) |
| `LessonSection` | 1 | الأقسام الأربعة المتاحة |
| `AppContextState` | 1 | جميع الخصائص المطلوبة |
| `ThemeContextState` | 1 | `mode` + `toggleTheme` |
| `SlugPageParams` | 1 | معلمات الصفحة الديناميكية (async `params`) |

### 4. `api.test.ts` — دوال API العميل (8 اختبار)

يختبر `app/lib/api.ts` مع محاكاة `fetch`:

| المجموعة | عدد الاختبارات | ما تختبره |
|----------|----------------|-----------|
| `getChatCompletion()` | 3 | طلب POST صحيح، معالجة خطأ الشبكة (500)، خطأ 401 |
| `getTranscription()` | 2 | إرسال FormData، معالجة خطأ الشبكة |
| `getTextCompletion()` | 3 | طلب POST صحيح، خطأ الشبكة، خطأ 429 |

**أسلوب الاختبار:** محاكاة `global.fetch` باستخدام `vi.fn()` — لا حاجة لخادم حقيقي.

### 5. `apiErrors.test.ts` — معالجة الأخطاء (8 اختبار)

يختبر `app/lib/apiErrors.ts` مع محاكاة `NextResponse`:

| المجموعة | عدد الاختبارات | ما تختبره |
|----------|----------------|-----------|
| `handleOpenAIError()` | 5 | خطأ 401، خطأ 429، خطأ آخر (500)، بدون status، رسائل بالعربية |
| `validateApiKey()` | 3 | وجود المفتاح (null)، عدم وجوده (500)، مفتاح فارغ |

### 6. `useThemeMode.test.tsx` — خطاف المظهر (3 اختبار)

| الاختبار | ما يختبره |
|----------|-----------|
| إعادة mode و toggleTheme | الخطاف يعيد القيم من السياق بشكل صحيح |
| وضع المظهر المظلم | يعكس `mode: 'dark'` عند تغيير السياق |
| خطأ خارج Provider | يرمي خطأ واضح إذا استُخدم خارج `ThemeProviderWrapper` |

### 7. `useAppContext.test.tsx` — خطاف سياق التطبيق (4 اختبار)

| الاختبار | ما يختبره |
|----------|-----------|
| جميع الخصائص | يعيد كل خصائص `AppContextState` |
| جميع الدوال | جميع setters و handlers متاحة |
| خطأ خارج Provider | يرمي خطأ واضح إذا استُخدم خارج `AppProvider` |
| الرسائل السابقة | مصفوفة فارغة بشكل افتراضي |

---

## ⚙️ الإعداد التقني

### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './app/__tests__/setupTests.ts',
    include: ['app/__tests__/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

### الحزم المطلوبة (devDependencies)

```json
{
  "vitest": "^4.x",
  "@testing-library/react": "^16.x",
  "@testing-library/jest-dom": "^6.x",
  "@vitejs/plugin-react": "^4.x",
  "jsdom": "^26.x"
}
```

---

## 📈 استراتيجية التغطية

| الطبقة | ملف الاختبار | الأولوية |
|--------|-------------|----------|
| الإعدادات | `config.test.ts` | ⭐⭐⭐ عالية |
| الأنواع | `types.test.ts` | ⭐⭐⭐ عالية |
| دوال API | `api.test.ts` | ⭐⭐⭐ عالية |
| معالجة الأخطاء | `apiErrors.test.ts` | ⭐⭐⭐ عالية |
| الخطافات المخصصة | `useThemeMode.test.tsx` + `useAppContext.test.tsx` | ⭐⭐ متوسطة |
| المكونات (UI) | — | ⭐ مستقبلي |
| الصفحات الديناميكية | — | ⭐ مستقبلي |

---

## 🔧 إضافة اختبار جديد

1. أنشئ ملفًا في `app/__tests__/` بامتداد `.test.ts` أو `.test.tsx`
2. استورد `describe`, `it`, `expect` من `vitest`
3. اكتب أسماء الاختبارات بالعربية: `it('يجب أن يعيد القيمة الصحيحة', ...)`
4. شغّل `npm test` للتحقق
5. حدّث هذا الملف بعدد الاختبارات الجديد

---

*آخر تحديث: مارس 2026 — 55 اختبار عبر 6 ملفات*
