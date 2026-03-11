# الدرس الأول: هيكل التطبيق والتهيئة 🏗️

> **هدف الدرس:** فهم كيف يبدأ تطبيق Next.js في العمل، وكيف نُنظم الثوابت والأنواع في ملفات مركزية

---

## 1. كيف يعمل Next.js App Router؟

تخيل أن مجلد `app/` هو **خريطة مبنى**: كل مجلد يمثّل طابقًا، وكل ملف `page.tsx` يمثّل غرفة يمكن زيارتها.

```text
app/
├── layout.tsx  // الإطار العام (الجدران والسقف)
├── providers.tsx  // مزودو الخدمات (كهرباء, ماء, إنترنت)
├── page.tsx  // الصفحة الرئيسية (الردهة)
├── config.ts  // دليل الإعدادات
├── styles.ts  // تنسيقات مركزية (أحجام خطوط, ألوان)
├── types.ts  // تعريف الأنواع
├── hooks/  // خطافات مخصصة (useAudioRecorder...)
└── [slug]/  // طوابق ديناميكية (حسب الدرس)
    ├── lecture/page.tsx
    ├── question/page.tsx
    └── ...
```

| المفهوم | الشرح |
|---------|-------|
| `layout.tsx` | يغلّف كل الصفحات — يُحمّل مرة واحدة |
| `page.tsx` | المحتوى الخاص بمسار معين |
| `[slug]` | مسار ديناميكي — يتغير حسب الدرس المختار |
| `providers.tsx` | يجمع كل مزودي السياق في مكان واحد |

---

## 2. ملف الإطار العام (`layout.tsx`)

هذا الملف هو **الهيكل الخارجي** — يحدد اللغة والاتجاه ويلف كل شيء بالمزودين:

```typescript
import type { Metadata } from 'next';
import { Providers } from './providers';
import { APP_NAME } from './config';

// بيانات وصفية للموقع (SEO)
export const metadata: Metadata = {
  title: APP_NAME,
  description: 'منصة تعليمية ذكية لتعلم اللغة الإنجليزية',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // dir="rtl" — اتجاه من اليمين لليسار (للعربية)
    <html lang="ar" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### لماذا `dir="rtl"`؟

| بدون RTL | مع RTL |
|----------|--------|
| النص يبدأ من اليسار | النص يبدأ من اليمين ✅ |
| القوائم مقلوبة | القوائم بالاتجاه الصحيح ✅ |
| أيقونات الأسهم خاطئة | أيقونات متوافقة ✅ |

---

## 3. ملف المزودين (`providers.tsx`)

يجمع كل مزودي السياق بترتيب محدد:

```typescript
'use client'; // مطلوب لأن المزودين يستخدمون useState

import { ThemeProviderWrapper } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProviderWrapper>    {/* 1. المظهر أولاً (يوفر الألوان) */}
      <AppProvider>           {/* 2. حالة التطبيق (تعتمد على المظهر) */}
        {children}
      </AppProvider>
    </ThemeProviderWrapper>
  );
}
```

تخيل المزودين مثل **طبقات البصلة**: الطبقة الخارجية (المظهر) تغلف الطبقة الداخلية (حالة التطبيق) التي تغلف المحتوى.

---

## 4. ملف الإعدادات (`config.ts`)

يجمع كل الثوابت في مكان واحد — لا نكرر القيم في ملفات متعددة:

```typescript
import type { LessonItem } from './types';

/** اسم التطبيق بالعربية */
export const APP_NAME = 'علمني';

/** اسم التطبيق بالإنجليزية */
export const APP_NAME_EN = 'Teach Me';

/** عرض القائمة الجانبية */
export const DRAWER_WIDTH = 270;

/** مفتاح تخزين المظهر */
export const THEME_STORAGE_KEY = 'theme-mode';

/** نموذج OpenAI المستخدم */
export const OPENAI_MODEL = 'gpt-4o-mini';

/** قائمة الدروس المتاحة */
export const LESSONS: LessonItem[] = [
  { slug: 'Simple-present', nameAr: 'المضارع البسيط' },
  { slug: 'Simple-past', nameAr: 'الماضي البسيط' },
  // ... 9 دروس
];

/** أقسام كل درس */
export const LESSON_SECTIONS = {
  lecture: 'شرح الدرس',
  question: 'أسئلة',
  conversation: 'محادثة',
  translate: 'ترجمة',
} as const;
```

| الثابت | الغرض | أين يُستخدم |
|--------|-------|------------|
| `APP_NAME` | عنوان التطبيق | AppBar، metadata |
| `DRAWER_WIDTH` | عرض القائمة الجانبية | SideBar، MainLayout |
| `THEME_STORAGE_KEY` | مفتاح localStorage | ThemeContext |
| `LESSONS` | قائمة الدروس | SideBar |
| `LESSON_SECTIONS` | أقسام كل درس | CustomizedListItem |

---

## 5. تعريف الأنواع (`types.ts`)

TypeScript يتطلب تعريف شكل البيانات مسبقًا — مثل **مخطط البناء** قبل البدء:

```typescript
export interface ChatMessage {
/** رسالة محادثة مع OpenAI */
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/** استجابة API القياسية */
export interface ApiResponse<T> {
  data: T;
  status: number;
}

/** بيانات إكمال المحادثة */
export interface ChatCompletionData {
  role: MessageRole;
  content: string;
}

/** عنصر درس */
export interface LessonItem {
  slug: string;
  nameAr: string;
}

/** وضع المظهر */
export type ThemeMode = 'light' | 'dark';
```

### ما فائدة الأنواع؟

| بدون TypeScript | مع TypeScript |
|----------------|---------------|
| `response.data.txt` (خطأ إملائي يمر) | خطأ فوري: `txt` غير موجود ✅ |
| لا تعرف شكل البيانات | IntelliSense يُظهر كل الخيارات ✅ |
| أخطاء في وقت التشغيل | أخطاء في وقت الكتابة ✅ |

---

## 6. التنسيقات المركزية (`styles.ts`)

ملف `styles.ts` يجمع كل التنسيقات المشتركة — أحجام الخطوط، ألوان الأقسام، وأنماط paper:

```typescript
export const fontSize = {
// أحجام خطوط متجاوبة — تتغير حسب حجم الشاشة تلقائيًا
  body: { xs: '14px', sm: '16px' },     // النص العادي
  heading: { xs: '18px', sm: '22px' },  // العناوين
  small: { xs: '12px', sm: '13px' },    // النص الصغير
  large: { xs: '16px', sm: '18px' },    // النص الكبير
};

// ألوان مميزة لكل قسم دراسي
export const sectionColors = {
  lecture: '#5B8CFF',      // أزرق — المحاضرة
  question: '#66BB6A',     // أخضر — الأسئلة
  conversation: '#FF7043',  // برتقالي — المحادثة
  translate: '#AB47BC',     // بنفسجي — الترجمة
};

// الأساس المشترك لكل صناديق paper
export const paperBase = {
  p: { xs: 1.5, sm: 2.5 }, // حشوة متجاوبة — أصغر على الموبايل
  mb: 2,                     // هامش سفلي
  whiteSpace: 'pre-wrap',   // الحفاظ على الأسطر الجديدة
};
```

| التصدير | الوظيفة |
|---------|---------|
| `fontSize` | أحجام خطوط متجاوبة (xs/sm) |
| `sectionColors` | ألوان مميزة لكل قسم |
| `paperBase` | أساس مشترك لكل Paper |
| `answerPaperSx()` | أنماط إجابة الذكاء الاصطناعي (حسب القسم) |
| `questionPaperSx()` | أنماط سؤال المستخدم |
| `neutralPaperSx` | أنماط محايدة (بدون لون قسم) |

---

## 7. خطافات مخصصة (`hooks/`)

مجلد `hooks/` يحتوي على خطافات React مخصصة قابلة لإعادة الاستخدام:

```text
hooks/
├── useAppContext.ts  // وصول آمن لحالة التطبيق
├── useThemeMode.ts  // وصول آمن لوضع المظهر
└── useAudioRecorder.ts  // تسجيل صوتي متوافق مع كل المتصفحات
```

```typescript
// useAudioRecorder — خطاف مخصص بديل عن مكتبات خارجية
// يكتشف تلقائيًا أفضل صيغة صوتية:
//   Chrome → audio/webm;codecs=opus
//   Safari → audio/mp4
//   قديم  → audio/ogg
const { status, mediaBlobUrl, startRecording, stopRecording } = useAudioRecorder();
```

---

## 8. ملف `globals.css`

يحدد المتغيرات CSS العامة ويضبط الهيكل الأساسي:

```css
:root {
  --max-width: 750px;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html, body {
  max-width: 100vw;
  overflow-x: hidden;
}
```

---

## 9. خلاصة

| المفهوم | ما تعلمناه |
|---------|-----------|
| App Router | مجلد `app/` يحدد المسارات تلقائيًا |
| `layout.tsx` | الإطار المشترك لكل الصفحات (RTL + metadata) |
| `providers.tsx` | تجميع المزودين بترتيب صحيح |
| `config.ts` | ثوابت مركزية لتجنب التكرار |
| `types.ts` | تعريف أشكال البيانات لأمان الكود |
| `styles.ts` | تنسيقات مركزية متجاوبة (fontSize, paperBase) |
| `hooks/` | خطافات مخصصة قابلة لإعادة الاستخدام |
| `as const` | يجعل القيم readonly في TypeScript |

---

*الدرس 1 من 6 — | [المسار التالي: نظام المظهر ←](./02-theme-system.md)*
