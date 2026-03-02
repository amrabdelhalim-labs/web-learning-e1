# دليل إضافة ميزات — علمني (web-learning-e1)

> **🛠️ دليل عملي خطوة بخطوة**
>
> يشرح هذا الملف كيفية إضافة درس جديد، قسم جديد، أو ميزات أخرى للتطبيق.

---

## جدول المحتويات

1. [إضافة درس جديد](#1-إضافة-درس-جديد)
2. [إضافة قسم جديد](#2-إضافة-قسم-جديد-lesson-section)
3. [تعديل Prompts OpenAI](#3-تعديل-prompts-openai)
4. [إضافة ثيم جديد](#4-إضافة-ثيم-جديد)
5. [إضافة API Route جديد](#5-إضافة-api-route-جديد)

---

## 1. إضافة درس جديد

### السيناريو

تريد إضافة درس **"Past Continuous"** (الماضي المستمر).

### الخطوات

#### 1.1 تحديث `app/config.ts`

أضف الدرس الجديد إلى `LESSONS` array:

```typescript
export const LESSONS: LessonItem[] = [
  { slug: 'present-simple'، nameAr: 'المضارع البسيط' }،
  { slug: 'present-continuous'، nameAr: 'المضارع المستمر' }،
  { slug: 'past-simple'، nameAr: 'الماضي البسيط' }،
  { slug: 'past-continuous'، nameAr: 'الماضي المستمر' }،  // ← الدرس الجديد
  // ... باقي الدروس
];
```

**ملاحظات:**
- `slug` يجب أن يكون **kebab-case** (أحرف صغيرة + شَرطات)
- `nameAr` هو الاسم العربي الذي يظهر في القائمة الجانبية
- الترتيب في المصفوفة = الترتيب في القائمة

#### 1.2 تحديث `LOADING_TEXTS`

أضف نصوص تحميل للدرس الجديد في `app/config.ts`:

```typescript
export const LOADING_TEXTS: Record<LessonSection، string[]> = {
  lecture: [
    'نُجهّز شرحاً واضحاً لك...'،
    // ...
  ]،
  question: [
    'نُجهّز سؤالاً مناسباً...'،
    // ...
  ]،
  conversation: [
    'نختار جملة مناسبة لك...'،
    // ...
  ]،
  translate: [
    'نُعدّ جملة للترجمة...'،
    // ...
  ]،
};
```

**ملاحظة:** نصوص التحميل مشتركة بين جميع الدروس — لا حاجة لتحديث إلا إذا أردت إضافة نصوص جديدة.

#### 1.3 اختبار

```bash
npm run dev
```

افتح المتصفح:
```
http://localhost:3000/past-continuous/lecture
http://localhost:3000/past-continuous/question
http://localhost:3000/past-continuous/conversation
http://localhost:3000/past-continuous/translate
```

**النتيجة:** جميع الصفحات تعمل تلقائياً! المحتوى يُولَّد ديناميكياً بناءً على `slug`.

---

## 2. إضافة قسم جديد (Lesson Section)

### السيناريو

تريد إضافة قسم **"Listening"** (استماع) إلى كل درس.

### الخطوات

#### 2.1 إضافة النوع إلى `app/types.ts`

```typescript
export type LessonSection = 'lecture' | 'question' | 'conversation' | 'translate' | 'listening';
```

#### 2.2 تحديث `LESSON_SECTIONS` في `app/config.ts`

```typescript
export const LESSON_SECTIONS: LessonSectionItem[] = [
  { key: 'lecture'، nameAr: 'المحاضرة'، icon: 'MenuBook' }،
  { key: 'question'، nameAr: 'الأسئلة'، icon: 'Quiz' }،
  { key: 'conversation'، nameAr: 'المحادثة'، icon: 'RecordVoiceOver' }،
  { key: 'translate'، nameAr: 'الترجمة'، icon: 'Translate' }،
  { key: 'listening'، nameAr: 'الاستماع'، icon: 'Headphones' }،  // ← القسم الجديد
];
```

#### 2.3 إضافة أيقونة في `CustomizedListItem.tsx`

```typescript
import HeadphonesIcon from '@mui/icons-material/Headphones';

const iconMap: Record<string، React.ComponentType<SvgIconProps>> = {
  MenuBook: MenuBookIcon،
  Quiz: QuizIcon،
  RecordVoiceOver: RecordVoiceOverIcon،
  Translate: TranslateIcon،
  Headphones: HeadphonesIcon،  // ← الأيقونة الجديدة
};
```

#### 2.4 إنشاء الصفحة `app/[slug]/listening/page.tsx`

```tsx
'use client';

import { useState، useEffect، useRef، use } from 'react';
import { Box، Button، CardContent، Typography } from '@mui/material';
import MainLayout from '@/app/layouts/MainLayout';
import { getChatCompletion } from '@/app/lib/api';
import { useAppContext } from '@/app/hooks/useAppContext';
import { getRandomLoadingText } from '@/app/config';
import type { SlugPageParams، ChatMessage } from '@/app/types';

export default function ListeningPage({ params }: SlugPageParams) {
  const { slug } = use(params);
  const [message، setMessage] = useState('');
  const [loading، setLoading] = useState(false);
  const hasInitialized = useRef(false);

  const {
    setShowAlert،
    setErrorMessage،
    setTextButton،
    setShowFooterButton،
    clearMessages،
  } = useAppContext();

  const getExercise = async () => {
    setLoading(true);
    setShowFooterButton(false);

    const prompt: ChatMessage = {
      role: 'user'،
      content: `As an English teacher for A2 students، create a simple listening exercise about "${slug}".

      Provide:
      1. A short dialogue (3-4 sentences)
      2. 2-3 comprehension questions in Arabic

      Keep it simple and suitable for A2 level.`،
    };

    const response = await getChatCompletion([prompt]);

    if (response.status === 200) {
      setMessage(response.data.content || '');
    } else {
      setShowAlert(true);
      setErrorMessage('حدث خطأ');
    }

    setShowFooterButton(true);
    setTextButton('تمرين جديد');
    setLoading(false);
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      clearMessages();
      getExercise();
    }
    return () => {
      clearMessages();
    };
  }، []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MainLayout
      loading={loading}
      onButtonClick={getExercise}
      loadingText={getRandomLoadingText('lecture')}  // أو أضف 'listening' للـ LOADING_TEXTS
    >
      {message && (
        <CardContent sx={{ mb: 14 }}>
          <Typography sx={{ whiteSpace: 'pre-line' }}>
            {message}
          </Typography>
        </CardContent>
      )}
    </MainLayout>
  );
}
```

#### 2.5 إضافة نصوص تحميل (اختياري)

في `app/config.ts`:

```typescript
export const LOADING_TEXTS: Record<LessonSection، string[]> = {
  // ... الأقسام الموجودة
  listening: [
    'نُعدّ تمريناً صوتياً...'،
    'نختار حواراً مناسباً...'،
    'نُجهّز أسئلة الفهم...'،
  ]،
};
```

#### 2.6 اختبار

```bash
npm run build  # تأكد من عدم وجود أخطاء TypeScript
npm run dev
```

افتح:
```
http://localhost:3000/present-simple/listening
```

---

## 3. تعديل Prompts OpenAI

### السيناريو

تريد تحسين جودة الأسئلة في صفحة **question**.

### الخطوات

#### 3.1 فتح `app/[slug]/question/page.tsx`

#### 3.2 تعديل الـ prompt

**قبل:**
```typescript
const questionPrompt: ChatMessage = {
  role: 'user'،
  content: `Create a multiple choice question about "${slug}" for A2 students...`،
};
```

**بعد (محسّن):**
```typescript
const questionPrompt: ChatMessage = {
  role: 'user'،
  content: `As an experienced English teacher for A2 Arabic-speaking students، create a challenging but fair multiple choice question about "${slug}".

  Requirements:
  - Question should test practical usage، not just definitions
  - Include a realistic context (e.g.، dialogue، short story)
  - 4 options: 1 correct + 3 plausible distractors
  - Distractors should represent common learner mistakes
  - Difficulty: slightly above A2 to encourage learning

  Format your response as JSON:
  {
    "question": "..."،
    "options": ["A: ..."، "B: ..."، "C: ..."، "D: ..."]،
    "correctAnswer": "A"
  }

  Respond ONLY with valid JSON، no explanation.`،
};
```

#### 3.3 تحديث معالجة الاستجابة

```typescript
const response = await getChatCompletion([questionPrompt]);
if (response.status === 200) {
  try {
    const parsed = JSON.parse(response.data.content);
    setQuestion(parsed.question);
    setOptions(parsed.options);
    setCorrectAnswer(parsed.correctAnswer);
  } catch {
    // fallback to old format
    setQuestion(response.data.content);
  }
}
```

#### 3.4 اختبار مكثف

```bash
# جرّب على عدة دروس مختلفة
npm run dev
```

افتح:
- `/present-simple/question`
- `/past-simple/question`
- `/modals-can-could/question`

**النتيجة:** أسئلة أكثر تحدياً وواقعية.

---

## 4. إضافة ثيم جديد

### السيناريو

تريد إضافة وضع **"High Contrast"** للأشخاص ذوي الإعاقة البصرية.

### الخطوات

#### 4.1 تحديث `app/types.ts`

```typescript
export type ThemeMode = 'light' | 'dark' | 'highContrast';
```

#### 4.2 تحديث `ThemeContext.tsx`

```typescript
const createAppTheme = (mode: ThemeMode): Theme => {
  let palette: PaletteOptions;

  switch (mode) {
    case 'light':
      palette = { mode: 'light'، primary: { main: '#1565c0' } };
      break;
    case 'dark':
      palette = { mode: 'dark'، primary: { main: '#90caf9' } };
      break;
    case 'highContrast':
      palette = {
        mode: 'dark'،
        primary: { main: '#FFFF00' }،  // أصفر فاقع
        background: { default: '#000000'، paper: '#000000' }،
        text: { primary: '#FFFFFF' }،
      };
      break;
  }

  return createTheme({ direction: 'rtl'، palette }، arSA);
};
```

#### 4.3 تحديث `ToolBar.tsx` — زر دوّار

```tsx
const modes: ThemeMode[] = ['light'، 'dark'، 'highContrast'];

const cycleTheme = () => {
  const currentIndex = modes.indexOf(mode);
  const nextIndex = (currentIndex + 1) % modes.length;
  toggleTheme(modes[nextIndex]);  // تحديث toggleTheme لقبول mode معيّن
};

const getIcon = () => {
  switch (mode) {
    case 'light': return <DarkModeIcon />;
    case 'dark': return <ContrastIcon />;
    case 'highContrast': return <LightModeIcon />;
  }
};

<IconButton onClick={cycleTheme}>{getIcon()}</IconButton>
```

#### 4.4 اختبار

```bash
npm run dev
```

اضغط على زر الثيم عدة مرات — يجب أن يدور بين 3 أوضاع.

---

## 5. إضافة API Route جديد

### السيناريو

تريد إضافة نقطة نهاية **/api/text-to-speech** لتحويل النص إلى صوت.

### الخطوات

#### 5.1 إنشاء `app/api/text-to-speech/route.ts`

```typescript
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { validateApiKey، handleOpenAIError } from '@/app/lib/apiErrors';

export async function POST(request: Request) {
  const keyError = validateApiKey();
  if (keyError) return keyError;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const { text } = await request.json();

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1'،
      voice: 'alloy'،
      input: text،
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new NextResponse(buffer، {
      status: 200،
      headers: {
        'Content-Type': 'audio/mpeg'،
        'Content-Length': buffer.length.toString()،
      }،
    });
  } catch (error) {
    return handleOpenAIError(error);
  }
}
```

#### 5.2 إضافة دالة في `app/lib/api.ts`

```typescript
export async function getTextToSpeech(text: string): Promise<Blob> {
  const res = await fetch('/api/text-to-speech'، {
    method: 'POST'،
    body: JSON.stringify({ text })،
    headers: { 'Content-Type': 'application/json' }،
  });

  if (!res.ok) {
    throw new Error('Text-to-speech failed');
  }

  return await res.blob();
}
```

#### 5.3 استخدام في صفحة

```tsx
import { getTextToSpeech } from '@/app/lib/api';

const playAudio = async () => {
  const audioBlob = await getTextToSpeech(message);
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
};

<Button onClick={playAudio} startIcon={<VolumeUpIcon />}>
  استمع للجملة
</Button>
```

#### 5.4 تحديث التوثيق

أضف النقطة الجديدة إلى:
- `docs/ai/architecture.md` (قسم API Routes)
- `docs/ai/README.md` (قائمة API Routes)

#### 5.5 اختبار

```bash
npm run build  # تأكد من عدم أخطاء
npm run dev
```

افتح أي صفحة تحتوي على الزر الجديد — يجب تشغيل الصوت.

---

## نصائح عامة

### قبل إضافة أي ميزة

1. **اقرأ التوثيق الموجود** (README.md، architecture.md، هذا الملف)
2. **ابحث عن نمط مشابه** في الكود الحالي — لا تخترع الدولاب
3. **ابدأ صغيراً** — prototype بسيط أولاً، ثم حسّن
4. **اختبر مبكراً** — `npm run build` بعد كل تعديل رئيسي

### بعد إضافة الميزة

```bash
# 1. TypeScript check
npx tsc --noEmit

# 2. Format code
npm run format

# 3. Build
npm run build

# 4. Test manually
npm run dev
```

### تحديث التوثيق

| الميزة المُضافة | التوثيق المطلوب |
|----------------|-----------------|
| درس جديد | `app/config.ts` فقط |
| قسم جديد | `app/config.ts` + `docs/ai/architecture.md` |
| API route جديد | `docs/ai/architecture.md` + `docs/ai/README.md` |
| Context جديد | `docs/ai/architecture.md` (State Management) |
| Utility جديد | `docs/ai/architecture.md` + JSDoc في الكود |

---

## أمثلة إضافية

### مثال: إضافة Hint System للأسئلة

**الهدف:** زر "تلميح" يُظهر مساعدة قبل الإجابة.

**الخطوات:**
1. أضف حالة `hint` في `question/page.tsx`
2. عدّل prompt ليطلب تلميحاً ضمن JSON:
   ```json
   {
     "question": "..."،
     "options": [...]،
     "correctAnswer": "A"،
     "hint": "فكّر في استخدام القاعدة مع الأفعال المنتظمة"
   }
   ```
3. أضف زر:
   ```tsx
   <Button onClick={() => setShowHint(true)}>
     💡 تلميح
   </Button>
   {showHint && <Alert severity="info">{hint}</Alert>}
   ```

### مثال: إضافة Progress Tracking

**الهدف:** حفظ التقدم في `localStorage`.

**الخطوات:**
1. أنشئ `app/lib/progress.ts`:
   ```typescript
   export function saveProgress(slug: string، section: string) {
     const key = `progress_${slug}_${section}`;
     localStorage.setItem(key، new Date().toISOString());
   }

   export function getProgress(slug: string، section: string): string | null {
     return localStorage.getItem(`progress_${slug}_${section}`);
   }
   ```
2. استدعي `saveProgress()` عند اكتمال القسم
3. عرض أيقونة ✅ في القائمة الجانبية للأقسام المكتملة

---

## الخلاصة

إضافة ميزات جديدة في **علمني** سهلة بفضل:
- **Config-driven design:** معظم التغييرات في `config.ts` فقط
- **Dynamic content:** لا محتوى ثابت — كل شيء مُولَّد بالـ AI
- **Consistent patterns:** كل الصفحات تتبع نفس النمط

**تذكّر:** البساطة أولاً — لا تُعقّد إلا عند الضرورة.

لأي أسئلة، راجع [`README.md`](../../README.md) أو [`CONTRIBUTING.md`](../../CONTRIBUTING.md).
