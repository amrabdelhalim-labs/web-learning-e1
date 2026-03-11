# دليل المفاهيم — مشروع علمني 📚

> شرح كل التقنيات والمفاهيم المستخدمة في المشروع من الصفر — للمبتدئين

---

## 1. Next.js و App Router

### ما هو Next.js؟

Next.js هو إطار عمل مبني على React يضيف ميزات مثل:
- **التوجيه التلقائي** — كل مجلد في `app/` يصبح مسارًا
- **مسارات API** — بناء خادم API داخل نفس المشروع
- **Server Components** — مكونات تعمل على الخادم فقط
- **Client Components** — مكونات تعمل في المتصفح

| المفهوم | الشرح | مثال |
|---------|-------|------|
| App Router | نظام التوجيه الحديث لـ Next.js | مجلد `app/` |
| `page.tsx` | ملف الصفحة — يُعرض عند زيارة المسار | `app/page.tsx` = `/` |
| `layout.tsx` | الإطار المشترك لكل الصفحات | `app/layout.tsx` |
| `route.ts` | نقطة API (Route Handler) | `app/api/chat-completion/route.ts` |
| `[slug]` | مسار ديناميكي — يتغير حسب الرابط | `app/[slug]/lecture/page.tsx` |
| `'use client'` | تعليمة تجعل المكون يعمل في المتصفح | أعلى الملف |

---

## 2. TypeScript

### ما هو TypeScript؟

لغة مبنية فوق JavaScript تضيف **أنواع البيانات** (types). تساعدك على اكتشاف الأخطاء أثناء الكتابة بدل وقت التشغيل.

```typescript
// JavaScript — لا تحذير
function greet(name) {
  return name.toUpperCase(); // ماذا لو name = 42؟ خطأ!
}

// TypeScript — يحذرك فورًا
function greet(name: string): string {
  return name.toUpperCase(); // آمن — name مضمون أنه نص
}
```

| المفهوم | الرمز | مثال |
|---------|-------|------|
| Interface | `interface` | `interface ChatMessage { role: string; content: string; }` |
| Type alias | `type` | `type ThemeMode = 'light' \| 'dark';` |
| Generic | `<T>` | `ApiResponse<ChatCompletionData>` |
| `as const` | تثبيت القيم | `LESSON_SECTIONS = { ... } as const` |
| Optional | `?` | `status?: number` |

---

## 3. MUI (Material UI)

### ما هو MUI؟

مكتبة مكونات جاهزة تتبع نظام تصميم Google (Material Design). بدلاً من بناء أزرار وقوائم من الصفر، تستخدم مكونات جاهزة.

| المكون | الاسم | الاستخدام |
|--------|-------|-----------|
| `Button` | زر | أزرار الإرسال والتفاعل |
| `TextField` | حقل نص | إدخال الأسئلة والترجمة |
| `AppBar` | شريط التطبيق | الشريط العلوي |
| `Drawer` | قائمة جانبية | قائمة الدروس |
| `IconButton` | زر أيقونة | تبديل المظهر، القائمة |
| `Snackbar` | تنبيه مؤقت | رسائل الخطأ |
| `Fade` | تأثير ظهور | انتقال سلس بين الصفحات |

### نظام الألوان (Theming):

```typescript
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  direction: 'rtl',          // من اليمين لليسار
  palette: {
    mode: 'dark',            // الوضع المظلم
    primary: { main: '#90caf9' },
  },
});
```

---

## 4. React Context

### ما هو Context؟

آلية في React لمشاركة البيانات بين المكونات بدون تمرير props عبر كل المستويات.

```text
│ App (state) → prop →     │
┌──────────────────────────┐
بدون Context (Prop Drilling):
│   Layout → prop →        │
│     SideBar → prop →     │
│       ListItem (يحتاج!)  │
└──────────────────────────┘

مع Context:
┌──────────────────────────┐
│ App                      │
│   Context.Provider       │
│     Layout (يقرأ ✅)     │
│     SideBar (يقرأ ✅)    │
│     ListItem (يقرأ ✅)   │
└──────────────────────────┘
```

| المفهوم | الدالة | الشرح |
|---------|--------|-------|
| إنشاء سياق | `createContext()` | يُنشئ "قناة" لتمرير البيانات |
| المزود | `<Context.Provider>` | يُغلّف المكونات ويوفر البيانات |
| الاستهلاك | `useContext()` | يقرأ البيانات من المزود |
| خطاف مخصص | `useAppContext()` | يُغلّف `useContext()` مع حماية |

---

## 5. Custom Hooks (الخطافات المخصصة)

### ما هي؟

دوال تبدأ بـ `use` تجمع منطقًا مشتركًا يمكن إعادة استخدامه:

```typescript
export function useThemeMode() {
// خطاف مخصص — يوفر الوصول للمظهر مع حماية
  const context = useContext(ThemeContext);
  if (!context) throw new Error('...');
  return context;
}

// الاستخدام — بسيط وآمن
const { mode, toggleTheme } = useThemeMode();
```

| الميزة | `useContext()` مباشرة | Custom Hook |
|--------|---------------------|-------------|
| حماية من null | لا | نعم ✅ |
| رسالة خطأ واضحة | لا | نعم ✅ |
| إعادة استخدام | نسخ الكود | استيراد واحد ✅ |

---

## 6. OpenAI API

### ما هي؟

واجهة برمجية من OpenAI تتيح التواصل مع نماذج الذكاء الاصطناعي (مثل GPT-4):

| النموذج | الاستخدام | المسار |
|---------|-----------|--------|
| `gpt-4o-mini` | محادثة، شرح، أسئلة، تقييم | `chat-completion` |
| `whisper-1` | تحويل الكلام لنص | `speech-to-text` |

### مفاهيم أساسية:

| المفهوم | الشرح |
|---------|-------|
| System Prompt | رسالة توجيه تخبر GPT بدوره (مثلاً: "أنت معلم") |
| Messages | مصفوفة الرسائل (system → user → assistant → user...) |
| Temperature | درجة الإبداع (0 = دقيق، 1 = إبداعي) |
| API Key | مفتاح سري للوصول إلى الخدمة |

---

## 7. Emotion و RTL

### Emotion:

مكتبة CSS-in-JS — تكتب أنماط CSS داخل JavaScript:

```typescript
import { styled } from '@emotion/styled';

const StyledBox = styled('div')({
  display: 'flex',
  padding: '16px',
});
```

### RTL (Right-to-Left):

دعم اللغات التي تُكتب من اليمين لليسار (العربية، العبرية):

```typescript
import rtlPlugin from '@mui/stylis-plugin-rtl';
import createCache from '@emotion/cache';

const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});
```

| بدون RTL | مع RTL |
|----------|--------|
| `margin-left: 8px` | يتحول تلقائيًا لـ `margin-right: 8px` |
| القوائم من اليسار | القوائم من اليمين ✅ |
| النصوص غير متناسقة | تخطيط متناسق ✅ |

---

## 8. Vitest (إطار الاختبار)

### ما هو Vitest؟

إطار اختبار حديث وسريع، متوافق مع Vite:

| المفهوم | الشرح | مثال |
|---------|-------|------|
| `describe` | مجموعة اختبارات | `describe('الدروس', () => {...})` |
| `it` / `test` | اختبار واحد | `it('يجب أن يكون 9 دروس', ...)` |
| `expect` | التحقق من النتيجة | `expect(LESSONS).toHaveLength(9)` |
| `vi.fn()` | دالة محاكاة | `const mock = vi.fn()` |
| `vi.mock()` | محاكاة وحدة كاملة | `vi.mock('next/server')` |
| `beforeEach` | تنفيذ قبل كل اختبار | تنظيف الحالة |

---

## 9. تنسيق الكود (Prettier)

### ما هو Prettier؟

أداة تنسيق تلقائي للكود — تضمن أن كل الملفات بنفس الأسلوب:

```bash
npm run format
# تنسيق كل الملفات

# فحص التنسيق (بدون تعديل)
npm run format:check
```

| الإعداد | القيمة | المعنى |
|---------|--------|--------|
| `semi` | `true` | فاصلة منقوطة في نهاية الأسطر |
| `singleQuote` | `true` | علامات اقتباس مفردة |
| `tabWidth` | `2` | مسافتان للمسافة البادئة |
| `endOfLine` | `lf` | نهاية سطر Unix (LF) |

---

## 10. Conventional Commits (رسائل الإيداع)

### ما هي؟

معيار لكتابة رسائل git commit بشكل منظم:

```text
type(scope): description

feat(app): add dark mode toggle
fix(api): handle 429 rate limit error
docs: update README with testing section
test(client): add vitest configuration and tests
chore(format): run Prettier across all source
```

| النوع | متى يُستخدم |
|-------|-------------|
| `feat` | ميزة جديدة |
| `fix` | إصلاح خطأ |
| `docs` | توثيق فقط |
| `test` | اختبارات فقط |
| `chore` | إعدادات وأدوات |
| `refactor` | إعادة هيكلة بدون تغيير السلوك |

---

## 11. المتغيرات البيئية

### ما هي؟

قيم سرية أو قابلة للتغيير تُخزن خارج الكود:

```env
# .env (محلي — لا يُرفع لـ git)
OPENAI_API_KEY=sk-...
```

| في Next.js | القاعدة |
|-----------|---------|
| بدون `NEXT_PUBLIC_` | server-side فقط (آمن) ✅ |
| مع `NEXT_PUBLIC_` | متاح في المتصفح (للعامة) |

---

*هذا الدليل يُحدّث كلما أُضيفت تقنية جديدة للمشروع*
