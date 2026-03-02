# الدرس الثاني: اختبارات جانب الخادم 🧪

> **هدف الدرس:** فهم كيفية اختبار دوال معالجة الأخطاء ومسارات API باستخدام Vitest مع محاكاة NextResponse

---

## 1. لماذا نختبر معالجة الأخطاء؟

تخيل أن معالجة الأخطاء مثل **شبكة أمان في السيرك** — لا تلاحظها أثناء العرض الناجح، لكنها تنقذ الموقف عند السقوط. الاختبارات تتأكد أن هذه الشبكة موجودة وتعمل.

| السيناريو | بدون اختبار | مع اختبار |
|-----------|-----------|----------|
| مفتاح API منتهي | المستخدم يرى خطأ تقني | المستخدم يرى رسالة عربية واضحة |
| طلبات كثيرة | التطبيق يتوقف | رسالة "انتظر قليلاً" |
| خطأ غير متوقع | صفحة بيضاء | رسالة "نرجو المحاولة لاحقًا" |

---

## 2. إعداد الاختبار (`apiErrors.test.ts`)

لاختبار `handleOpenAIError` و `validateApiKey`، نحتاج محاكاة `NextResponse`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// محاكاة NextResponse — لأنه يعمل فقط في بيئة Next.js
vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: Record<string, unknown>, init?: { status?: number }) => ({
      body,
      status: init?.status ?? 200,
    }),
  },
}));

// الاستيراد بعد المحاكاة — مهم جدًا!
const { handleOpenAIError, validateApiKey } = await import('@/app/lib/apiErrors');
```

| المفهوم | الشرح |
|---------|-------|
| `vi.mock()` | تستبدل وحدة برمجية بنسخة مزيفة |
| `await import()` | استيراد ديناميكي بعد تفعيل المحاكاة |
| `body` + `status` | البنية المبسطة لاستجابة NextResponse |

---

## 3. اختبار `handleOpenAIError()`

### اختبار خطأ المصادقة (401)

```typescript
it('يجب أن يعيد 401 عند خطأ مصادقة', () => {
  const error = { status: 401, message: 'Unauthorized' };
  const response = handleOpenAIError(error);

  expect(response.status).toBe(401);
  expect(response.body.error).toContain('API_KEY');
});
```

### اختبار تجاوز الحد (429)

```typescript
it('يجب أن يعيد 429 عند تجاوز حد الطلبات', () => {
  const error = { status: 429, message: 'Rate limited' };
  const response = handleOpenAIError(error);

  expect(response.status).toBe(429);
  expect(response.body.error).toContain('فترة زمنية');
});
```

### اختبار الأخطاء غير المتوقعة

```typescript
it('يجب أن يعيد 500 لأي خطأ آخر', () => {
  const error = { status: 503, message: 'Service unavailable' };
  const response = handleOpenAIError(error);

  expect(response.status).toBe(500);
  expect(response.body.error).toContain('مشكلة في الخادم');
});
```

### اختبار أن الرسائل بالعربية

```typescript
it('يجب أن يعيد رسائل خطأ بالعربية', () => {
  const errors = [{ status: 401 }, { status: 429 }, { status: 500 }];

  errors.forEach((error) => {
    const response = handleOpenAIError(error);
    // التحقق من وجود أحرف عربية (Unicode range)
    expect(response.body.error).toMatch(/[\u0600-\u06FF]/);
  });
});
```

---

## 4. اختبار `validateApiKey()`

```typescript
describe('validateApiKey()', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // نسخ البيئة الأصلية قبل كل اختبار
    process.env = { ...originalEnv };
  });

  it('يجب أن يعيد null عند وجود المفتاح', () => {
    process.env.OPENAI_API_KEY = 'sk-test-key';
    const result = validateApiKey();
    expect(result).toBeNull(); // لا خطأ
  });

  it('يجب أن يعيد خطأ عند عدم وجود المفتاح', () => {
    delete process.env.OPENAI_API_KEY;
    const result = validateApiKey();

    expect(result).not.toBeNull();
    expect(result.status).toBe(500);
    expect(result.body.error).toContain('API_KEY');
  });
});
```

| الحالة | القيمة المُعادة | المعنى |
|--------|----------------|--------|
| المفتاح موجود | `null` | لا مشكلة، اكمل |
| المفتاح مفقود | `{ status: 500, body: {...} }` | أوقف وأعد خطأ |
| المفتاح فارغ | `{ status: 500, body: {...} }` | نفس المفقود |

---

## 5. أنماط الاختبار المستخدمة

| النمط | الشرح | مثال |
|-------|-------|------|
| **المحاكاة (Mock)** | استبدال وحدة حقيقية بنسخة مزيفة | `vi.mock('next/server')` |
| **التحقق من الحالة** | فحص رمز الحالة في الاستجابة | `expect(response.status).toBe(401)` |
| **التحقق من المحتوى** | فحص نص الرسالة | `expect(body.error).toContain('API_KEY')` |
| **تعديل البيئة** | تغيير متغيرات البيئة مؤقتًا | `process.env = { ...originalEnv }` |
| **regex** | مطابقة أنماط النص | `toMatch(/[\u0600-\u06FF]/)` |

---

## 6. خلاصة

| المفهوم | ما تعلمناه |
|---------|-----------|
| محاكاة NextResponse | `vi.mock('next/server')` لاختبار دوال الخادم في بيئة Vitest |
| الاستيراد الديناميكي | استخدام `await import()` بعد المحاكاة |
| اختبار الأخطاء | فحص كل رمز حالة (401, 429, 500) على حدة |
| اختبار البيئة | تعديل `process.env` واستعادته بين الاختبارات |
| الرسائل بالعربية | التحقق من وجود أحرف عربية باستخدام regex |

---

*الدرس 2 من 2 — [← مسار السابق: مسارات API](./01-api-routes.md)*
