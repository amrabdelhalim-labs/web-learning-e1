# الدرس الخامس: الصفحات الديناميكية — الشرح والأسئلة والمحادثة والترجمة 📄

> **هدف الدرس:** فهم كيف تعمل الصفحات الديناميكية الأربع وكيف يتفاعل كل قسم مع OpenAI بطريقة مختلفة

---

## 1. ما هي الصفحات الديناميكية؟

في Next.js، المجلد `[slug]` يعني **مسار ديناميكي** — يتغير محتواه حسب الدرس المختار.

تخيل أن `[slug]` مثل **قالب طباعة**: القالب واحد لكن المحتوى يتغير حسب الموضوع.

```
/Simple-present/lecture     → صفحة شرح + slug = "Simple-present"
/plural-nouns/question      → صفحة أسئلة + slug = "plural-nouns"
/Adverbs/conversation       → صفحة محادثة + slug = "Adverbs"
/Simple-past/translate      → صفحة ترجمة + slug = "Simple-past"
```

| القسم | الملف | نوع التفاعل | مسار API |
|-------|-------|------------|---------|
| شرح | `[slug]/lecture/page.tsx` | قراءة نص | `chat-completion` |
| أسئلة | `[slug]/question/page.tsx` | اختيار من متعدد | `chat-completion` |
| محادثة | `[slug]/conversation/page.tsx` | تسجيل صوتي | `speech-to-text` + `chat-completion` |
| ترجمة | `[slug]/translate/page.tsx` | إدخال نص | `text-completion` + `chat-completion` |

---

## 2. صفحة الشرح (`lecture/page.tsx`)

أبسط الصفحات — تطلب شرحًا من GPT وتعرضه:

```typescript
'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/app/hooks/useAppContext';
import { getChatCompletion } from '@/app/lib/api';
import MainLayout from '@/app/layouts/MainLayout';
import { getRandomLoadingText } from '@/app/config';
import type { SlugPageParams } from '@/app/types';

export default function LecturePage({ params }: SlugPageParams) {
  const {
    messages, setMessages,
    setContextPreviousMessage,
    clearMessages,
  } = useAppContext();

  useEffect(() => {
    // حل params (في Next.js 16 هي Promise)
    params.then(({ slug }) => {
      clearMessages();

      // بناء رسالة النظام (system prompt)
      const systemMessage = {
        role: 'system' as const,
        content: `أنت معلم لغة إنجليزية. اشرح درس "${slug}" بالعربية لمستوى A2.`,
      };

      // إرسال الطلب لـ OpenAI
      getChatCompletion([systemMessage]).then((response) => {
        if (response.status === 200) {
          setMessages([
            { role: 'assistant', content: response.data.content },
          ]);
        }
      });

      // حفظ system prompt للأسئلة المتابعة
      setContextPreviousMessage([systemMessage]);
    });
  }, [params]);

  return (
    <MainLayout>
      {messages.length === 0 ? (
        <p>{getRandomLoadingText('lecture')}</p>
      ) : (
        <div>{messages[0]?.content}</div>
      )}
    </MainLayout>
  );
}
```

### التسلسل:

```
المستخدم يختار "المضارع البسيط > شرح"
    │
    ▼
params.slug = "Simple-present"
    │
    ▼
system prompt: "اشرح درس Simple-present..."
    │
    ▼
getChatCompletion([systemMessage])
    │
    ▼
GPT يعيد الشرح بالعربية
    │
    ▼
عرض الشرح في الصفحة
```

---

## 3. صفحة الأسئلة (`question/page.tsx`)

تطلب سؤال اختيار من متعدد وتتحقق من الإجابة:

```typescript
// بناء رسالة النظام لتوليد سؤال
const systemMessage = {
  role: 'system' as const,
  content: `
    أنت معلم لغة إنجليزية.
    أنشئ سؤال اختيار من متعدد عن "${slug}" لمستوى A2.
    الصيغة: السؤال، 4 خيارات (A-D)، والإجابة الصحيحة.
  `,
};
```

| الحالة | ما يحدث |
|--------|---------|
| التحميل | عرض نص تحميل عشوائي من `LOADING_TEXTS.question` |
| عرض السؤال | 4 أزرار خيارات + السؤال |
| إجابة صحيحة | تلوين أخضر + رسالة تشجيع |
| إجابة خاطئة | تلوين أحمر + الإجابة الصحيحة |
| سؤال جديد | زر "سؤال جديد" يعيد الطلب |

---

## 4. صفحة المحادثة (`conversation/page.tsx`)

الأكثر تعقيدًا — تستخدم تسجيل الصوت عبر المتصفح:

```typescript
// استيراد ديناميكي لمكتبة التسجيل (لأنها تحتاج المتصفح)
import dynamic from 'next/dynamic';
const ReactMediaRecorder = dynamic(
  () => import('react-media-recorder').then((mod) => mod.ReactMediaRecorder),
  { ssr: false } // لا تُحمّل على الخادم
);
```

### تسلسل المحادثة:

```
1. GPT يُولّد جملة إنجليزية
    │
    ▼
2. المستخدم يضغط 🎤 ويقرأ الجملة
    │
    ▼
3. التسجيل الصوتي يُرسل لـ Whisper (speech-to-text)
    │
    ▼
4. النتيجة النصية تُقارن مع الجملة الأصلية
    │
    ▼
5. GPT يُقيّم النطق ويعطي ملاحظات
```

**لماذا `dynamic()` مع `ssr: false`؟**

`react-media-recorder` يستخدم `navigator.mediaDevices` الذي لا يعمل إلا في المتصفح. لو حاول Next.js تحميله على الخادم سيحدث خطأ.

التشبيه: هذا مثل **ميكروفون لا يعمل إلا عندما تقف أمامه** — لا يمكنك اختباره عن بُعد.

| المكتبة | الدور |
|---------|-------|
| `react-media-recorder` | تسجيل الصوت من المتصفح |
| `next/dynamic` | استيراد مكونات فقط في المتصفح |
| Whisper API | تحويل الصوت لنص |

---

## 5. صفحة الترجمة (`translate/page.tsx`)

تدعم اتجاهين: إنجليزي → عربي وعربي → إنجليزي:

```typescript
// توليد جملة للترجمة
const generateSentence = async () => {
  const prompt = direction === 'en-to-ar'
    ? `أنشئ جملة إنجليزية بسيطة عن "${slug}" لمستوى A2`
    : `أنشئ جملة عربية بسيطة عن "${slug}" لمستوى A2`;

  const response = await getTextCompletion(prompt);
  // عرض الجملة وانتظار ترجمة المستخدم
};

// تقييم الترجمة
const evaluateTranslation = async () => {
  const response = await getChatCompletion([
    {
      role: 'system',
      content: 'قيّم ترجمة المستخدم وأعطه ملاحظات تصحيحية',
    },
    {
      role: 'user',
      content: `الجملة: "${original}" — ترجمة المستخدم: "${userTranslation}"`,
    },
  ]);
};
```

| الاتجاه | الإدخال | المطلوب |
|---------|---------|---------|
| EN → AR | جملة إنجليزية | ترجمتها للعربية |
| AR → EN | جملة عربية | ترجمتها للإنجليزية |

---

## 6. النمط المشترك: `params` في Next.js 16

في Next.js 16، `params` أصبحت `Promise` — يجب حلها أولاً:

```typescript
export default function Page({ params }: SlugPageParams) {
  useEffect(() => {
    params.then(({ slug }) => {
      // استخدام slug هنا
      console.log('الدرس:', slug);
    });
  }, [params]);
}

// بنية SlugPageParams:
interface SlugPageParams {
  params: Promise<{ slug: string }>;
}
```

---

## 7. خلاصة

| المفهوم | ما تعلمناه |
|---------|-----------|
| `[slug]` | مسارات ديناميكية تتغير حسب الدرس |
| System Prompt | توجيه GPT ليتصرف كمعلم |
| `dynamic()` | تحميل مكونات فقط في المتصفح (SSR: false) |
| Whisper | تحويل الكلام لنص عبر OpenAI |
| اتجاه الترجمة | تبديل بين EN↔AR ديناميكيًا |
| `params: Promise` | ميزة جديدة في Next.js 16 |
| `getRandomLoadingText()` | نصوص تحميل عشوائية تناسب كل قسم |

---

*الدرس 5 من 6 — [← المكونات](./04-components.md) | [اختبارات العميل →](./06-testing.md)*
