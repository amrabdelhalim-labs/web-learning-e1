# المرجع السريع — مشروع علمني 📋

> جداول مرجعية سريعة لكل أوامر وأنماط المشروع — للاستخدام اليومي

---

## أوامر التطوير

| الأمر | الوصف |
|-------|-------|
| `npm run dev` | تشغيل خادم التطوير (localhost:3000) |
| `npm run build` | بناء المشروع للإنتاج |
| `npm start` | تشغيل نسخة الإنتاج |
| `npm test` | تشغيل الاختبارات (مرة واحدة) |
| `npm run test:watch` | تشغيل الاختبارات (مراقبة مستمرة) |
| `npm run test:coverage` | تقرير تغطية الاختبارات |
| `npm run format` | تنسيق الكود تلقائيًا |
| `npm run format:check` | فحص التنسيق بدون تعديل |
| `npm run lint` | فحص جودة الكود |

---

## هيكل المجلدات

```text
app/
├── layout.tsx  // الإطار الرئيسي (HTML, metadata, providers)
├── providers.tsx  // مزودات السياق (Theme + App + RTL)
├── page.tsx  // الصفحة الرئيسية (/)
├── globals.css  // أنماط CSS عامة
├── [slug]/  // صفحات الدروس الديناميكية
│   ├── lecture/  // صفحة المحاضرة
│   ├── question/  // صفحة الأسئلة
│   ├── conversation/  // صفحة المحادثة
│   └── translate/  // صفحة الترجمة
├── api/
│   ├── route.ts        ← Health check
│   ├── chat-completion/← GPT-4 محادثة
│   ├── speech-to-text/ ← Whisper تحويل صوت
│   └── text-completion/← GPT-4 إكمال نص
├── components/  // مكونات مشتركة
├── context/            ← React Context
├── controllers/  // دوال جلب البيانات
├── layouts/  // تخطيطات الصفحات
├── tests/  // ملفات الاختبار (Vitest)
├── hooks/  // خطافات مخصصة (useAudioRecorder, useAppContext...)
├── styles.ts  // تنسيقات مركزية (fontSize, paperBase, sectionColors)
├── config.ts  // ثوابت وإعدادات
├── types.ts  // أنواع TypeScript
└── lib/  // أدوات مشتركة (api, apiErrors)
```

---

## ملفات الإعداد

| الملف | الغرض |
|-------|-------|
| `next.config.js` | إعدادات Next.js |
| `tsconfig.json` | إعدادات TypeScript |
| `vitest.config.ts` | إعدادات الاختبارات |
| `package.json` | التبعيات والأوامر |
| `.prettierrc.json` | إعدادات التنسيق |
| `.gitattributes` | إعدادات Git (نهايات الأسطر) |
| `.env` | متغيرات بيئية محلية |
| `.env.example` | نموذج المتغيرات البيئية |
| `jsconfig.json` | اختصارات المسارات |

---

## أنماط React المستخدمة

### Context + Provider + Custom Hook

```typescript
const ThemeContext = createContext<ThemeContextState | null>(null);
// 1. إنشاء سياق

// 2. مزود يحتوي المنطق
function ThemeProvider({ children }) {
  const [mode, setMode] = useState<ThemeMode>('dark');
  return <ThemeContext.Provider value={{ mode, toggleTheme }}>{children}</ThemeContext.Provider>;
}

// 3. خطاف مخصص آمن
function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProvider');
  return ctx;
}
```

### خطاف مخصص للتسجيل الصوتي

```typescript
// app/hooks/useAudioRecorder.ts — يعمل على كل المتصفحات بما فيها Safari/iOS
import { useAudioRecorder } from '@/app/hooks/useAudioRecorder';

const { status, mediaBlobUrl, startRecording, stopRecording, clearBlobUrl, isSupported, error } =
  useAudioRecorder();
```

---

## أنماط API المستخدمة

### Route Handler

```typescript
// app/api/chat-completion/route.ts
export async function POST(request: NextRequest) {
  const apiKey = validateApiKey();
  if (apiKey) return apiKey; // NextResponse error

  const { messages } = await request.json();
  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages,
  });

  return NextResponse.json({ data: response.choices[0].message });
}
```

### معالجة الأخطاء المركزية

```typescript
// app/lib/apiErrors.ts
function handleOpenAIError(error: unknown): NextResponse {
  if (error instanceof OpenAI.APIError) {
    if (error.status === 401) return respond(401, 'مفتاح API غير صالح');
    if (error.status === 429) return respond(429, 'تجاوز الحد المسموح');
  }
  return respond(500, 'خطأ غير متوقع');
}
```

---

## أنماط الاختبار

### اختبار دالة بسيطة

```typescript
it('اسم التطبيق صحيح', () => {
  expect(APP_NAME).toBe('علمني');
});
```

### محاكاة fetch

```typescript
beforeEach(() => {
  global.fetch = vi.fn();
});

it('يرسل طلب POST', async () => {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ data: 'result' }),
  });

  const result = await getChatCompletion(messages);
  expect(global.fetch).toHaveBeenCalledWith('/api/chat-completion', expect.any(Object));
});
```

### اختبار خطاف مخصص

```typescript
const wrapper = ({ children }) => (
  <ThemeContext.Provider value={{ mode: 'dark', toggleTheme: vi.fn() }}>
    {children}
  </ThemeContext.Provider>
);

it('يعيد المظهر', () => {
  const { result } = renderHook(() => useThemeMode(), { wrapper });
  expect(result.current.mode).toBe('dark');
});
```

---

## ثوابت مهمة

| الثابت | القيمة | الملف |
|--------|--------|-------|
| `APP_NAME` | `'علمني'` | `config.ts` |
| `APP_NAME_EN` | `'Teach Me'` | `config.ts` |
| `OPENAI_MODEL` | `'gpt-4o-mini'` | `config.ts` |
| `DRAWER_WIDTH` | `270` | `config.ts` |
| `MAX_CONTENT_WIDTH` | `750` | `config.ts` |
| `THEME_STORAGE_KEY` | `'theme-mode'` | `config.ts` |
| `LESSONS` | 9 دروس | `config.ts` |
| `LESSON_SECTIONS` | 4 أقسام | `config.ts` |

---

## الدروس وأقسامها

| القسم | المسار | الوصف |
|-------|--------|-------|
| المحاضرة | `/[slug]/lecture` | شرح الدرس مع GPT |
| الأسئلة | `/[slug]/question` | أسئلة تفاعلية مع تقييم |
| المحادثة | `/[slug]/conversation` | ممارسة محادثة صوتية |
| الترجمة | `/[slug]/translate` | تمارين ترجمة ثنائية الاتجاه |

---

## التبعيات الرئيسية

| الحزمة | الإصدار | الاستخدام |
|--------|---------|-----------|
| `next` | 16.x | إطار العمل |
| `react` | 19.x | مكتبة واجهة المستخدم |
| `typescript` | 5.9.x | أنواع البيانات |
| `@mui/material` | 7.x | مكونات التصميم |
| `openai` | 6.x | SDK الذكاء الاصطناعي |
| `react-markdown` | 10.x | عرض Markdown كـ React |
| `remark-gfm` | 4.x | دعم جداول GitHub Markdown |
| `@emotion/react` | 11.x | CSS-in-JS |
| `vitest` | 4.x | إطار الاختبارات |
| `prettier` | 3.x | تنسيق الكود |

---

## روابط الدروس التعليمية

### دروس الخادم

| # | الدرس | الملف |
|---|-------|-------|
| 1 | [مسارات API و OpenAI](server/01-api-routes.md) | `server/01-api-routes.md` |
| 2 | [اختبار معالجة الأخطاء](server/02-testing.md) | `server/02-testing.md` |

### دروس العميل

| # | الدرس | الملف |
|---|-------|-------|
| 1 | [هيكل التطبيق](client/01-app-structure.md) | `client/01-app-structure.md` |
| 2 | [نظام المظهر](client/02-theme-system.md) | `client/02-theme-system.md` |
| 3 | [إدارة الحالة](client/03-state-management.md) | `client/03-state-management.md` |
| 4 | [المكونات المشتركة](client/04-components.md) | `client/04-components.md` |
| 5 | [الصفحات الديناميكية](client/05-dynamic-pages.md) | `client/05-dynamic-pages.md` |
| 6 | [اختبارات العميل](client/06-testing.md) | `client/06-testing.md` |

### المراجع

| الملف | الوصف |
|-------|-------|
| [دليل المفاهيم](concepts-guide.md) | شرح كل التقنيات من الصفر |
| [المرجع السريع](quick-reference.md) | هذا الملف |

---

*آخر تحديث: يوليو 2025*
