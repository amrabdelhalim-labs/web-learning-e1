# توجيهات AI — علمني (Teach Me / web-learning-e1)

> **📘 دليل البداية السريعة للمساعدين AI**
> 
> اقرأ هذا الملف **دائماً** قبل إجراء أي تعديل على هذا المشروع.
> يحتوي على القواعد الأساسية، المعمارية المختصرة، والأنماط الإلزامية.

---

## 1. هوية المشروع

| الخاصية | القيمة |
|---------|--------|
| **الاسم العربي** | علمني |
| **الاسم الإنجليزي** | Teach Me |
| **اسم المجلد** | `web-learning-e1` |
| **الغرض** | منصة تعلم اللغة الإنجليزية تفاعلية بالذكاء الاصطناعي |
| **المستوى التعليمي** | A2 (مبتدئ - متوسط) |
| **اللغة الأساسية** | عربي (UI) + إنجليزي (المحتوى التعليمي) |

---

## 2. المعمارية المختصرة

**نوع المشروع:** Next.js 16 App Router — single-package (لا monorepo)

```
app/
├── types.ts              ← جميع تعريفات الأنواع
├── config.ts             ← ثوابت التطبيق (LESSONS، APP_NAME، ASK_ME_SYSTEM_PROMPT، etc.)
├── styles.ts             ← تنسيقات مركزية (ألوان الأقسام، أنماط Paper، fontSize)
├── context/              ← React Contexts (ThemeContext، AppContext)
├── hooks/                ← Custom hooks (useThemeMode، useAppContext، useAudioRecorder)
├── lib/                  ← Utilities (api.ts، apiErrors.ts)
├── components/           ← React components (ToolBar، SideBar، Footer، MarkdownRenderer)
├── layouts/              ← Layout wrappers (MainLayout)
├── api/                  ← API Routes (chat-completion، speech-to-text)
└── [slug]/               ← Dynamic pages (lecture، question، conversation، translate)
```

**لا توجد قاعدة بيانات** — كل المحتوى مُولَّد ديناميكياً عبر OpenAI API.

---

## 3. القواعد الإلزامية

### المعمارية

| القاعدة | التفاصيل |
|---------|---------|
| **Context + Custom Hook** | الوصول لـ Theme via `useThemeMode()`، لا `useContext(ThemeContext)` |
| **API Utilities** | جميع API calls في `app/lib/api.ts`، لا inline `fetch()` |
| **Types First** | استخدم الأنواع من `app/types.ts`، لا inline type definitions |
| **Config Centralization** | جميع الثوابت في `app/config.ts` (LESSONS، APP_NAME، etc.) |
| **Error Handling** | استخدم `handleOpenAIError()` من `apiErrors.ts` — رسائل عربية |
| **Layout Pattern** | صفحات المحتوى تستخدم `MainLayout` wrapper |
| **Centralized Styles** | ألوان الأقسام وأنماط Paper و`fontSize` في `app/styles.ts`، لا hardcoded hex colors أو px |
| **Audio Recording** | تسجيل الصوت عبر `useAudioRecorder` hook، لا `react-media-recorder` |
| **Markdown Rendering** | ردود AI تُعرض عبر `MarkdownRenderer`، لا plain text أو `split('\n')` |
| **System Prompt** | خاصية "اسألني" تبدأ بـ `ASK_ME_SYSTEM_PROMPT` من `config.ts` |

### التسميات

| النوع | النمط | مثال |
|------|------|------|
| **الملفات** | camelCase.ts/tsx | `useThemeMode.ts`، `MainLayout.tsx` |
| **المكونات** | PascalCase | `ToolBar`، `SideBar`، `MainLayout` |
| **hooks** | use + PascalCase | `useThemeMode`، `useAppContext` |
| **Contexts** | PascalCase + Context | `ThemeContext`، `AppContext` |
| **API Routes** | kebab-case | `chat-completion/route.ts` |

### الأنماط

| الخاصية | القيمة |
|---------|--------|
| **المسافات البادئة** | 2 فراغ (بواسطة Prettier) |
| **Quotes** | Single quotes `'text'` |
| **Semicolons** | نعم `;` |
| **Line endings** | LF (مُفرَض عبر `.gitattributes`) |
| **Max line length** | 100 حرف |

---

## 4. نمط Context + Custom Hook

### ✅ الطريقة الصحيحة

```typescript
// صفحة أو مكون
import { useThemeMode } from '@/app/hooks/useThemeMode';

function MyComponent() {
  const { mode، toggleTheme } = useThemeMode();
  // ✅ safe - will show error if used outside provider
}
```

### ❌ الطريقة الخاطئة

```typescript
// ❌ لا تفعل هذا
import { ThemeContext } from '@/app/context/ThemeContext';
import { useContext } from 'react';

function MyComponent() {
  const context = useContext(ThemeContext);
  // ❌ no type safety، no null check، breaks pattern
}
```

**السبب:** Custom hooks تُوفّر:
- Type safety تلقائي
- Null check مدمج
- Single source of truth
- سهولة إعادة الهيكلة

---

## 5. دوال API (lib/api.ts)

### المتاحة

```typescript
// Chat completion (GPT-4o-mini)
getChatCompletion(messages: ChatMessage[]): Promise<ApiResponse<ChatCompletionData>>

// Speech-to-text (Whisper)
getTranscription(blobUrl: string): Promise<ApiResponse<TranscriptionData>>

// Text completion (legacy)
getTextCompletion(prompt: string): Promise<ApiResponse<TextCompletionData>>
```

### الاستخدام

```typescript
import { getChatCompletion } from '@/app/lib/api';
import type { ChatMessage } from '@/app/types';

const messages: ChatMessage[] = [
  { role: 'user'، content: 'Explain present simple' }
];

const response = await getChatCompletion(messages);
if (response.status === 200) {
  console.log(response.data.content); // AI response
}
```

---

## 6. الثوابت (app/config.ts)

### الثوابت الرئيسية

```typescript
export const APP_NAME = 'علمني';
export const APP_NAME_EN = 'Teach Me';
export const DRAWER_WIDTH = 270;
export const THEME_STORAGE_KEY = 'theme-mode';
export const OPENAI_MODEL = 'gpt-4o-mini';

// 9 دروس قواعد
export const LESSONS: LessonItem[] = [
  { slug: 'present-simple'، nameAr: 'المضارع البسيط' }،
  // ...
];

// 4 أقسام لكل درس
export const LESSON_SECTIONS: LessonSectionItem[] = [
  { key: 'lecture'، nameAr: 'المحاضرة'، icon: 'MenuBook' }،
  // ...
];
```

### استخدامها

```typescript
import { APP_NAME، LESSONS } from '@/app/config';

// ✅ استخدم الثابت
<Typography>{APP_NAME}</Typography>

// ❌ لا hardcode
<Typography>علمني</Typography>
```

---

## 7. الوضع الليلي/النهاري

### الألوان

| الوضع | اللون الأساسي | الخلفية | النص |
|-------|--------------|---------|------|
| `light` | `#1565c0` | `#ffffff` | `rgba(0، 0، 0، 0.87)` |
| `dark` | `#90caf9` | `#121212` | `#ffffff` |

### التخزين

```typescript
// المفتاح في localStorage
THEME_STORAGE_KEY = 'theme-mode'

// القيم الممكنة
'light' | 'dark'
```

### الزر

زر التبديل في `ToolBar` component:
- **DarkModeIcon** عند الوضع light (للتبديل إلى dark)
- **LightModeIcon** عند الوضع dark (للتبديل إلى light)

---

## 8. API Routes

### النقاط المتاحة

| المسار | الوصف | Input | Output |
|--------|-------|-------|--------|
| `/api/chat-completion` | GPT-4o-mini chat | `{ messages: ChatMessage[] }` | `{ role، content }` |
| `/api/speech-to-text` | Whisper transcription | `FormData(audio file)` | `{ text }` |
| `/api/text-completion` | Legacy completion | `{ prompt: string }` | `{ text }` |

### معالجة الأخطاء

```typescript
import { validateApiKey، handleOpenAIError } from '@/app/lib/apiErrors';

export async function POST(request: Request) {
  const keyError = validateApiKey();
  if (keyError) return keyError; // 500 + Arabic message

  try {
    const response = await openai.chat.completions.create({...});
    return NextResponse.json({ role، content }، { status: 200 });
  } catch (error) {
    return handleOpenAIError(error); // Returns Arabic error by status code
  }
}
```

**رسائل الأخطاء** (عربية):
- `401` — "مفتاح API غير صحيح"
- `429` — "تجاوزت الحد المسموح من الطلبات"
- `500` — "خطأ في الخادم"
- `503` — "الخدمة غير متاحة حالياً"

---

## 9. الصفحات الديناميكية (app/[slug]/...)

### المسارات

```typescript
/present-simple/lecture        ← شرح المضارع البسيط
/present-simple/question       ← أسئلة اختيار من متعدد
/present-simple/conversation   ← تسجيل صوتي + تقييم نطق
/present-simple/translate      ← ترجمة EN↔AR + تقييم
```

### نمط slug

```typescript
// كل صفحة تستقبل slug ديناميكي:
export default function LecturePage({ params }: SlugPageParams) {
  const { slug } = use(params); // 'present-simple'
  // ...
}
```

### كل صفحة تستخدم `MainLayout`

```tsx
return (
  <MainLayout loading={loading} onButtonClick={getNewContent}>
    <CardContent>
      {/* محتوى الصفحة */}
    </CardContent>
  </MainLayout>
);
```

---

## 10. متغيرات البيئة

### `.env` (local only — لا تُودَع)

```env
OPENAI_API_KEY=sk-...
```

### `.env.example` (يُودَع في Git)

```env
OPENAI_API_KEY=
```

**ملاحظة حرجة:** لا تضع المفتاح الحقيقي في `.env.example` أبداً.

---

## 11. TypeScript

### الأنواع الأساسية (app/types.ts)

```typescript
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface ApiResponse<T = Record<string، unknown>> {
  data: T;
  status: number;
}

export type ThemeMode = 'light' | 'dark';

export interface SlugPageParams {
  params: Promise<{ slug: string }>;
}
```

### استخدامها

```typescript
import type { ChatMessage، ApiResponse، SlugPageParams } from '@/app/types';
```

---

## 12. الدروس المتاحة

| Slug | الاسم العربي |
|------|-------------|
| `present-simple` | المضارع البسيط |
| `present-continuous` | المضارع المستمر |
| `past-simple` | الماضي البسيط |
| `future-with-will` | المستقبل بـ will |
| `comparative-adjectives` | صفات المقارنة |
| `superlative-adjectives` | صفات التفضيل |
| `modals-can-could` | أفعال الكيفية can/could |
| `modals-should-must` | أفعال الكيفية should/must |
| `prepositions-time` | حروف الجر للزمن |

---

## 13. الأقسام لكل درس

| Key | الاسم العربي | الأيقونة |
|-----|-------------|----------|
| `lecture` | المحاضرة | MenuBook |
| `question` | الأسئلة | Quiz |
| `conversation` | المحادثة | RecordVoiceOver |
| `translate` | الترجمة | Translate |

---

## 14. خطوات قبل الإيداع

```bash
# 1. TypeScript check
npx tsc --noEmit

# 2. Prettier check
npm run format:check

# 3. Tests
npm test

# 4. Build
npm run build
```

**يجب نجاح الكل قبل `git commit`.**

---

## 15. الاختبارات

يحتوي المشروع على **55 اختبارًا** عبر **6 ملفات** باستخدام **Vitest 4.x**:

```bash
npm test            # تشغيل مرة واحدة
npm run test:watch  # وضع المراقبة
```

| الملف | العدد | التغطية |
|-------|-------|--------|
| `config.test.ts` | 18 | ثوابت، دروس، getRandomLoadingText |
| `types.test.ts` | 14 | أشكال الأنواع والواجهات |
| `api.test.ts` | 8 | getChatCompletion، getTranscription، getTextCompletion |
| `apiErrors.test.ts` | 8 | handleOpenAIError، validateApiKey |
| `useThemeMode.test.tsx` | 3 | خطاف المظهر مع Provider |
| `useAppContext.test.tsx` | 4 | خطاف حالة التطبيق |

التفاصيل الكاملة: [`../../docs/testing.md`](../../docs/testing.md)

---

## 16. الدروس التعليمية

يحتوي المشروع على **8 دروس تعليمية** مع دليل مفاهيم ومرجع سريع:

| المجلد | عدد الدروس | المحتوى |
|--------|-----------|--------|
| `docs/tutorials/server/` | 2 | مسارات API، اختبار الأخطاء |
| `docs/tutorials/client/` | 6 | هيكل التطبيق، المظهر، الحالة، المكونات، الصفحات، الاختبارات |

| الملف المرجعي | الوصف |
|-------------|-------|
| [`tutorials/README.md`](../tutorials/README.md) | فهرس الدروس ومسارات التعلم |
| [`tutorials/concepts-guide.md`](../tutorials/concepts-guide.md) | شرح كل التقنيات من الصفر |
| [`tutorials/quick-reference.md`](../tutorials/quick-reference.md) | جداول وأوامر مرجعية سريعة |

---

## 17. الموارد الإضافية

| الملف | المحتوى |
|-------|--------|
| [`architecture.md`](architecture.md) | المعمارية التفصيلية (Contexts، Routes، Flows) |
| [`feature-guide.md`](feature-guide.md) | دليل إضافة درس أو قسم جديد |
| [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md) | قواعد المساهمة، الإيداعات، التنسيق |
| [`../../README.md`](../../README.md) | وثائق المشروع الكاملة |
| [`../../docs/testing.md`](../testing.md) | مرجع الاختبارات التفصيلي |
| [`../../docs/tutorials/`](../tutorials/README.md) | الدروس التعليمية (10 ملفات) |

---

**تذكّر:** هذا مشروع تعليمي — الهدف **التعلّم**، ليس الإنتاج الفوري. التزم بالأنماط لسهولة الصيانة والتوسّع.
