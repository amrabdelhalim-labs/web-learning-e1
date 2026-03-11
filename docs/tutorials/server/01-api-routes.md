# الدرس الأول: مسارات API — التواصل مع الذكاء الاصطناعي 🤖

> **هدف الدرس:** فهم كيفية عمل مسارات API في Next.js وكيف يتواصل التطبيق مع OpenAI لتوليد المحتوى التعليمي

---

## 1. ما هي مسارات API في Next.js؟

في Next.js (App Router)، يمكنك إنشاء نقاط وصول API مباشرة داخل مجلد `app/api/` — دون الحاجة لخادم منفصل.

تخيل أن كل ملف `route.ts` هو **نافذة خدمة** في مبنى: كل نافذة تستقبل طلبًا محددًا وتعيد إجابة مناسبة.

```text
app/api/
├── chat-completion/
│   └── route.ts  // نافذة المحادثة مع GPT
├── speech-to-text/
│   └── route.ts  // نافذة تحويل الصوت لنص
└── text-completion/
    └── route.ts  // نافذة إكمال النصوص
```

| المفهوم | الشرح |
|---------|-------|
| Route Handler | ملف `route.ts` يصدّر دوال HTTP (`GET`, `POST`, إلخ) |
| `NextResponse` | كائن الاستجابة المدمج في Next.js |
| Server-side فقط | هذه الملفات تعمل على الخادم ولا تُرسل للمتصفح |

---

## 2. مسار المحادثة (`chat-completion/route.ts`)

هذا هو المسار الأساسي — يستقبل رسائل المستخدم ويرسلها لـ GPT-4o-mini:

```typescript
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
// استيراد دوال معالجة الأخطاء المركزية
import { handleOpenAIError, validateApiKey } from '@/app/lib/apiErrors';

// إنشاء عميل OpenAI — يقرأ المفتاح من المتغير البيئي تلقائيًا
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  // التحقق من وجود مفتاح API
  const keyError = validateApiKey();
  if (keyError) return keyError;

  try {
    // قراءة الرسائل من الطلب
    const { messages } = await request.json();

    // إرسال الطلب لـ OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    // إعادة النتيجة
    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    // معالجة الأخطاء بشكل مركزي
    return handleOpenAIError(error);
  }
}
```

### تسلسل البيانات:

```text
   │── POST /api/chat ────────►│                            │
   │                           │                            │
المتصفح                    الخادم (Next.js)              OpenAI API
   │   { messages: [...] }     │── openai.chat.create() ──►│
   │                           │                            │
   │                           │◄── { role, content } ─────│
   │◄── { role, content } ────│                            │
```

---

## 3. مسار تحويل الصوت (`speech-to-text/route.ts`)

يستقبل ملفًا صوتيًا ويحوله لنص باستخدام نموذج Whisper:

```typescript
export async function POST(request: Request) {
  const keyError = validateApiKey();
  if (keyError) return keyError;

  try {
    // استخراج الملف الصوتي من FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // إرسال الملف لنموذج Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    return handleOpenAIError(error);
  }
}
```

| الخطوة | الشرح |
|--------|-------|
| `request.formData()` | قراءة بيانات النموذج (تشمل الملفات) |
| `formData.get('file')` | استخراج الملف الصوتي |
| `whisper-1` | نموذج OpenAI لتحويل الكلام إلى نص |

---

## 4. مسار إكمال النص (`text-completion/route.ts`)

يُستخدم لتوليد نصوص (ترجمة، توليد جمل، إلخ):

```typescript
export async function POST(request: Request) {
  const keyError = validateApiKey();
  if (keyError) return keyError;

  try {
    const { message } = await request.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: message }],
    });

    return NextResponse.json({
      text: completion.choices[0].message.content,
    });
  } catch (error) {
    return handleOpenAIError(error);
  }
}
```

### الفرق بين المسارات:

| المسار | الإدخال | الإخراج | الاستخدام |
|--------|---------|---------|-----------|
| `chat-completion` | مصفوفة رسائل | `{ role, content }` | محادثة مستمرة (شرح، أسئلة) |
| `speech-to-text` | ملف صوتي (FormData) | `{ text }` | تقييم النطق |
| `text-completion` | نص واحد | `{ text }` | ترجمة، توليد جمل |

---

## 5. معالجة الأخطاء المركزية (`apiErrors.ts`)

بدلاً من تكرار كود الأخطاء في كل مسار، نضعه في ملف واحد:

```typescript
export function handleOpenAIError(error: unknown): NextResponse {
// معالجة أخطاء OpenAI — تعيد رسائل بالعربية حسب نوع الخطأ
  const apiError = error as { status?: number; message?: string };

  if (apiError.status === 401) {
    // مفتاح API غير صالح
    return NextResponse.json(
      { error: 'يرجى التأكد من إضافتك ال API_KEY الخاص بك ومن صلاحيته!' },
      { status: 401 }
    );
  }

  if (apiError.status === 429) {
    // تجاوز حد الطلبات
    return NextResponse.json(
      { error: 'قمت بأكثر من طلب خلال فترة زمنية قصيرة...' },
      { status: 429 }
    );
  }

  // أي خطأ آخر
  return NextResponse.json(
    { error: 'هنالك مشكلة في الخادم, نرجو المحاولة لاحقًا!' },
    { status: 500 }
  );
}
```

التشبيه: `handleOpenAIError` مثل **مركز خدمة العملاء** — يستقبل الشكوى ويعطي رسالة مفهومة بدل رسالة تقنية معقدة.

---

## 6. التحقق من مفتاح API (`validateApiKey`)

```typescript
export function validateApiKey(): NextResponse | null {
// يتحقق من وجود OPENAI_API_KEY في البيئة
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'يرجى التأكد من إضافتك ال API_KEY الخاص بك ومن صلاحيته!' },
      { status: 500 }
    );
  }
  return null; // المفتاح موجود, لا خطأ
}
```

| القيمة المُعادة | المعنى |
|----------------|--------|
| `null` | المفتاح موجود — اكمل العمل |
| `NextResponse` | المفتاح مفقود — أعد الخطأ فورًا |

---

## 7. خلاصة

| المفهوم | ما تعلمناه |
|---------|-----------|
| Route Handlers | إنشاء نقاط API داخل Next.js بدون خادم منفصل |
| OpenAI SDK | استخدام `openai.chat.completions.create()` و `openai.audio.transcriptions.create()` |
| معالجة الأخطاء | تجميع الأخطاء في ملف مركزي مع رسائل بالعربية |
| أمان المفتاح | المتغيرات بدون `NEXT_PUBLIC_` لا تصل للمتصفح |
| FormData | كيفية استقبال الملفات في مسارات API |

---

*الدرس 1 من 2 — | [مسار التالي: اختبارات الخادم ←](./02-testing.md)*
