# علمني — منصة تعلم اللغة الإنجليزية بالذكاء الاصطناعي

منصة تفاعلية لتعلم اللغة الإنجليزية مبنية بـ **Next.js 16 + TypeScript** مع **OpenAI GPT-4o-mini** لتوليد محتوى ديناميكي ودعم الوضع الليلي/النهاري باستخدام **Material-UI 7**.

---

## جدول المحتويات

- [نظرة عامة](#نظرة-عامة)
- [الميزات الرئيسية](#الميزات-الرئيسية)
- [البنية التقنية](#البنية-التقنية)
- [متطلبات التشغيل](#متطلبات-التشغيل)
- [التثبيت والإعداد](#التثبيت-والإعداد)
- [البنية الهيكلية](#البنية-الهيكلية)
- [المعمارية](#المعمارية)
- [واجهة OpenAI](#واجهة-openai)
- [الثيمات والوضع الليلي](#الثيمات-والوضع-الليلي)
- [الأدوات والنصوص](#الأدوات-والنصوص)
- [الاختبارات](#الاختبارات)
- [النشر](#النشر-deployment)
- [التوثيق](#التوثيق)
- [المساهمة](#المساهمة)
- [الترخيص](#الترخيص)

---

## نظرة عامة

**علمني** (Teach Me) منصة تعليمية تفاعلية لتعلم قواعد اللغة الإنجليزية للمستوى A2. تستخدم المنصة **الذكاء الاصطناعي** لتوليد محتوى ديناميكي وتقديم تجربة شخصية لكل متعلم عبر:

- **المحاضرات**: شرح تفصيلي لقواعد اللغة الإنجليزية بأسلوب واضح ومبسّط
- **الأسئلة**: اختيار من متعدد لتطبيق القاعدة مع تقييم فوري
- **المحادثة**: تسجيل صوتي وتقييم نطق الجمل الإنجليزية
- **الترجمة**: ترجمة ثنائية الاتجاه (إنجليزي ↔ عربي) مع تقييم دقة الترجمة

النظام مصمم بواجهة عربية كاملة مع دعم RTL، وضع ليلي/نهاري، وتصميم متجاوب يعمل على جميع الأجهزة.

---

## الميزات الرئيسية

### الذكاء الاصطناعي التفاعلي
- توليد محتوى ديناميكي لكل درس (لا محتوى ثابت)
- تقييم فوري للإجابات مع ملاحظات شخصية
- تحويل الصوت إلى نص باستخدام **Whisper API**
- توليد أسئلة وجمل متنوعة في كل جلسة
- عرض ردود الذكاء الاصطناعي بتنسيق **Markdown** كامل (عناوين، قوائم، جداول، كود)
- نظام **"اسألني"** مع أمر أولي (System Prompt) يحتوي على سياق التطبيق الكامل

### دروس قواعد اللغة الإنجليزية
يحتوي التطبيق على **9 دروس** لقواعد اللغة الإنجليزية:
1. present-simple — المضارع البسيط
2. present-continuous — المضارع المستمر
3. past-simple — الماضي البسيط
4. future-with-will — المستقبل بـ will
5. comparative-adjectives — صفات المقارنة
6. superlative-adjectives — صفات التفضيل
7. modals-can-could — أفعال الكيفية can/could
8. modals-should-must — أفعال الكيفية should/must
9. prepositions-time — حروف الجر للزمن

كل درس يحتوي على 4 أقسام: محاضرة، أسئلة، محادثة، ترجمة.

### الثيمات والوضع الليلي
- تبديل سلس بين الوضع النهاري والليلي
- اكتشاف تفضيل النظام تلقائياً
- حفظ التفضيل في **localStorage**
- ألوان احترافية (Light: `#1565c0` / Dark: `#90caf9`)
- تأثيرات زجاجية (glass-morphism) في شريط الأدوات

### دعم التسجيل الصوتي
- تسجيل صوت المستخدم عبر **react-media-recorder**
- إرسال التسجيل إلى **Whisper API** لتحويله إلى نص
- تقييم نطق الجملة مقارنة بالنص الصحيح
- ملاحظات مخصصة لتحسين النطق

---

## البنية التقنية

### الواجهة (Frontend)
| التقنية | النسخة | الاستخدام |
|---------|--------|-----------|
| **Next.js** | 16.0.9 | إطار عمل React مع App Router |
| **React** | 19.2.2 | بناء واجهة المستخدم |
| **TypeScript** | 5.9.3 | Type safety وأدوات تطوير محسّنة |
| **Material-UI** | 7.3.8 | مكتبة مكونات UI مع دعم RTL |
| **Emotion** | 11.14.0+ | CSS-in-JS للتصميم |
| **@mui/stylis-plugin-rtl** | 7.3.8 | دعم RTL في MUI |

### الخدمات الخلفية (API)
| التقنية | النسخة | الاستخدام |
|---------|--------|-----------|
| **OpenAI SDK** | 6.25.0 | الوصول إلى GPT-4o-mini و Whisper |
| **Next.js API Routes** | 16.0.9 | نقاط النهاية الخلفية |

### أدوات التطوير
| الأداة | النسخة | الاستخدام |
|--------|--------|-----------|| **Vitest** | 4.0.x | إطار الاختبارات (78 اختبارًا عبر 7 ملفات) |
| **@testing-library/react** | 16.x | اختبار مكونات React والخطافات || **Prettier** | 3.8.1 | تنسيق الكود بشكل موحّد |
| **ESLint** | مدمج | فحص الكود (فاعلية Next.js) |

---

## متطلبات التشغيل

- **Node.js** ≥ 18.x (يُفضّل 20.x)
- **npm** ≥ 9.x
- مفتاح **OpenAI API** (احصل عليه من [platform.openai.com](https://platform.openai.com/api-keys))

---

## التثبيت والإعداد

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd web-learning-e1
```

### 2. تثبيت الاعتماديات

```bash
npm install
```

### 3. إعداد المتغيرات البيئية

أنشئ ملف `.env` في جذر المشروع (انسخ من `.env.example`):

```bash
cp .env.example .env
```

ثم أضف مفتاح OpenAI API الخاص بك:

```env
OPENAI_API_KEY=sk-...
```

### 4. تشغيل البيئة التطويرية

```bash
npm run dev
```

افتح المتصفح على [http://localhost:3000](http://localhost:3000)

### 5. بناء الإنتاج

```bash
npm run build
npm start
```

---

## البنية الهيكلية

```text
web-learning-e1/
├── app/                           # مجلد Next.js App Router
│   ├── types.ts                   # تعريفات الأنواع (ChatMessage, ApiResponse, etc.)
│   ├── config.ts                  # ثوابت التطبيق (LESSONS, APP_NAME, etc.)
│   ├── globals.css                # CSS عام مع متغيرات الثيم (dark/light)
│   ├── layout.tsx                 # Root layout مع metadata
│   ├── page.tsx                   # الصفحة الرئيسية (قائمة الميزات)
│   ├── providers.tsx              # Context providers wrapper
│   ├── context/                   # React contexts
│   │   ├── ThemeContext.tsx       # إدارة الثيم (light/dark)
│   │   └── AppContext.tsx         # حالة التطبيق (messages, alerts)
│   ├── hooks/                     # Custom hooks
│   │   ├── useThemeMode.ts        # hook للوصول إلى ThemeContext
│   │   └── useAppContext.ts       # hook للوصول إلى AppContext
│   ├── lib/                       # Utility functions
│   │   ├── api.ts                 # دوال API (getChatCompletion, etc.)
│   │   └── apiErrors.ts           # معالجة الأخطاء (رسائل عربية)
│   ├── components/                # React components
│   │   ├── ToolBar/               # شريط الأدوات (مع زر تبديل الثيم)
│   │   ├── SideBar/               # القائمة الجانبية (قائمة الدروس)
│   │   └── Footer/                # تذييل الصفحة (زر "جملة جديدة")
│   ├── layouts/                   # Layout components
│   │   └── MainLayout.tsx         # Layout مشترك لصفحات المحتوى
│   ├── api/                       # API Routes
│   │   ├── chat-completion/       # OpenAI chat completions
│   │   │   └── route.ts
│   │   ├── speech-to-text/        # Whisper transcription
│   │   │   └── route.ts
│   │   └── text-completion/       # OpenAI text completion
│   │       └── route.ts
│   └── [slug]/                    # مسارات ديناميكية (slug = اسم الدرس)
│       ├── lecture/               # صفحة المحاضرة
│       │   └── page.tsx
│       ├── question/              # صفحة الأسئلة
│       │   └── page.tsx
│       ├── conversation/          # صفحة المحادثة (تسجيل صوتي)
│       │   └── page.tsx
│       └── translate/             # صفحة الترجمة (EN↔AR)
│           └── page.tsx
├── docs/                          # Documentation
│   ├── testing.md                 # مرجع الاختبارات (55 اختبارًا)
│   ├── ai/                        # توجيهات AI (للمطورين/AI assistants)
│   │   ├── README.md              # دليل البداية السريعة
│   │   ├── architecture.md        # المعمارية التفصيلية
│   │   └── feature-guide.md       # دليل إضافة ميزات
│   └── tutorials/                 # الدروس التعليمية (10 ملفات)
│       ├── README.md              # فهرس الدروس
│       ├── concepts-guide.md      # دليل المفاهيم
│       ├── quick-reference.md     # مرجع سريع
│       ├── server/                # 2 درس (API routes, اختبارات)
│       └── client/                # 6 دروس (الهيكل إلى الاختبارات)
│   └── README.md                  # مرجع المشاريع في Workspace
├── public/                        # Static assets
│   ├── _redirects                 # إعادة توجيه Netlify (SPA fallback)
│   └── 404.html                   # صفحة الخطأ 404
├── .env                           # متغيرات البيئة (لا تُودَع في Git)
├── .env.example                   # نموذج المتغيرات البيئية
├── .prettierrc.json               # إعداد Prettier
├── .prettierignore                # ملفات يتجاهلها Prettier
├── .gitattributes                 # فرض LF line endings
├── format.mjs                     # سكريبت تنسيق cross-platform
├── tsconfig.json                  # إعداد TypeScript
├── next.config.ts                 # إعداد Next.js
├── package.json                   # الاعتماديات + النصوص
├── CONTRIBUTING.md                # دليل المساهمة
└── README.md                      # هذا الملف
```

---

## المعمارية

### نمط Context + Custom Hook

جميع الحالة العامة مُدارة عبر **React Context** مع custom hooks للوصول:

```typescript
import { useThemeMode } from '@/app/hooks/useThemeMode';
// ✅ صحيح
const { mode, toggleTheme } = useThemeMode();

// ❌ خاطئ — لا تستورد الـ Context مباشرة
import { ThemeContext } from '@/app/context/ThemeContext';
```

### طبقات المعمارية

```text
┌─────────────────────────────────────────┐
│         Pages (app/[slug]/...)          │  ← UI + user interaction
├─────────────────────────────────────────┤
│      Layouts + Components               │  ← MainLayout, ToolBar, SideBar
├─────────────────────────────────────────┤
│  Contexts (ThemeContext, AppContext)    │  ← Global state management
├─────────────────────────────────────────┤
│  Custom Hooks (useThemeMode, etc.)      │  ← Abstraction layer
├─────────────────────────────────────────┤
│      API Utilities (lib/api.ts)         │  ← Client-side API calls
├─────────────────────────────────────────┤
│  API Routes (app/api/**/route.ts)       │  ← Server-side endpoints
├─────────────────────────────────────────┤
│           OpenAI SDK                     │  ← GPT-4o-mini + Whisper
└─────────────────────────────────────────┘
```

### تدفق البيانات

#### 1. Chat Completion (محاضرة، أسئلة، ترجمة)

```text
[Page Component]
    ↓ calls getChatCompletion([messages])
[lib/api.ts]
    ↓ POST /api/chat-completion
[API Route]
    ↓ validateApiKey()
    ↓ openai.chat.completions.create()
[OpenAI GPT-4o-mini]
    ↓ response
[API Route]
    ↓ handleOpenAIError() if error
    ↓ return { data: { role, content }, status }
[Page Component]
    ↓ update UI with response
```

#### 2. Speech-to-Text (محادثة)

```text
[conversation/page.tsx]
    ↓ user records audio → blob URL
    ↓ calls getTranscription(blobUrl)
[lib/api.ts]
    ↓ fetch blob → File object
    ↓ POST /api/speech-to-text (FormData)
[API Route]
    ↓ validateApiKey()
    ↓ openai.audio.transcriptions.create()
[OpenAI Whisper]
    ↓ transcription text
[API Route]
    ↓ return { data: { text }, status }
[conversation/page.tsx]
    ↓ display transcription + evaluation
```

---

## واجهة OpenAI

### API Routes المتاحة

| المسار | الطريقة | الاستخدام |
|--------|---------|-----------|
| `/api/chat-completion` | POST | Chat completions (GPT-4o-mini) |
| `/api/speech-to-text` | POST | تحويل الصوت إلى نص (Whisper) |
| `/api/text-completion` | POST | Text completion (legacy endpoint) |

### الأنواع المُعرَّفة

```typescript
// app/types.ts
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ApiResponse<T = Record<string, unknown>> {
  data: T;
  status: number;
}

export interface ChatCompletionData {
  role: MessageRole;
  content: string;
}
```

### دوال API (Client-side)

```typescript
// app/lib/api.ts
export async function getChatCompletion(
  messages: ChatMessage[]
): Promise<ApiResponse<ChatCompletionData>>;

export async function getTranscription(
  blobUrl: string
): Promise<ApiResponse<TranscriptionData>>;

export async function getTextCompletion(
  prompt: string
): Promise<ApiResponse<TextCompletionData>>;
```

---

## الثيمات والوضع الليلي

### نظام الثيمات

يستخدم التطبيق **Material-UI theming** مع دعم كامل للوضعين الليلي والنهاري:

```typescript
// app/context/ThemeContext.tsx
const lightTheme = createAppTheme('light');
const darkTheme = createAppTheme('dark');
```

### الألوان

| الوضع | اللون الأساسي | الخلفية | النص |
|-------|--------------|---------|------|
| **Light** | `#1565c0` | `#ffffff` | `rgba(0, 0, 0, 0.87)` |
| **Dark** | `#90caf9` | `#121212` | `#ffffff` |

### التخزين المحلي

يُحفظ تفضيل الثيم في **localStorage** بمفتاح `'theme-mode'`:

```typescript
localStorage.setItem('theme-mode', 'dark'); // أو 'light'
```

### زر التبديل

زر تبديل الثيم موجود في **AppBar** داخل `ToolBar` component مع أيقونات:
- **DarkModeIcon** — عند الوضع النهاري (للتبديل إلى الليلي)
- **LightModeIcon** — عند الوضع الليلي (للتبديل إلى النهاري)

---

## الأدوات والنصوص

### النصوص المتاحة

```json
{
  "dev": "تشغيل بيئة التطوير (http://localhost:3000)",
  "build": "بناء الإنتاج",
  "start": "تشغيل بيئة الإنتاج",
  "lint": "فحص الكود بـ ESLint",
  "format": "تنسيق الكود بـ Prettier (write mode)",
  "format:check": "التحقق من تنسيق الكود (CI mode)"
}
```

### استخدام Prettier

```bash
npm run format
# تنسيق جميع الملفات
# أو
node format.mjs

# التحقق بدون كتابة (للـ CI)
npm run format:check
# أو
node format.mjs --check
```

### إعداد .gitattributes

يُفرض **LF line endings** على جميع الملفات النصية عبر `.gitattributes`:

```gitattributes
* text=auto eol=lf
```

لتطبيق الإعداد على الملفات الموجودة:

```bash
git add --renormalize .
```

---

## الاختبارات

يستخدم المشروع **Vitest 4.x** مع **@testing-library/react** وبيئة **jsdom**.

| المعيار | القيمة |
|---------|--------|
| إجمالي الاختبارات | **78** |
| ملفات الاختبار | **7** |
| إطار الاختبار | Vitest 4.x + jsdom |

### تشغيل الاختبارات

```bash
npm test
# تشغيل مرة واحدة

# وضع المراقبة (أثناء التطوير)
npm run test:watch

# تقرير التغطية
npm run test:coverage
```

التفاصيل الكاملة في [`docs/testing.md`](docs/testing.md).

---

## النشر (Deployment)

### الاستضافة الموصى بها

| المنصة | المميزات | التكلفة | الأنسب لـ |
|--------|----------|---------|----------|
| **Vercel** | صفر إعداد، HTTPS تلقائي، CDN عالمي | مجاني (Hobby) | Next.js apps |
| **Heroku** | سهل الإعداد، إدارة بسيطة | $5-7/شهر (Eco/Basic) | بيئة تعلم |
| **Railway** | $5 رصيد مجاني، بدون cold starts | Pay-as-you-go | Small apps |
| **Netlify** | Netlify Edge، تكامل Git | مجاني (100GB) | Static + SSR |

### نشر سريع على Vercel (الأسهل)

```bash
npm i -g vercel
# 1. تثبيت Vercel CLI

# 2. نشر
vercel

# 3. إضافة متغيرات البيئة
vercel env add OPENAI_API_KEY

# 4. نشر للإنتاج
vercel --prod
```

### نشر على Heroku (خطوة بخطوة)

```bash
heroku create my-ai-learning-app
# 1. إنشاء تطبيق Heroku

# 2. إضافة متغيرات البيئة
heroku config:set OPENAI_API_KEY=sk-proj-...

# 3. النشر
git push heroku main

# 4. فتح التطبيق
heroku open
```

### دليل النشر الشامل

لدليل شامل يغطي جميع المنصات، استكشاف الأخطاء، CI/CD، والأمان:

👉 **[راجع `docs/deployment.md`](docs/deployment.md)**

يحتوي على:
- إعداد Heroku/Vercel/Railway/Render من الصفر
- استراتيجيات المراقبة والنسخ الاحتياطي
- استكشاف الأخطاء الشائعة
- تقدير التكاليف ونصائح الأداء
- أمان المفاتيح وتحديد معدل الطلبات
- خطة Rollback والتوسع

---

## التوثيق

### للمطورين

| الملف | الغرض |
|-------|--------|
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | دليل المساهمة (قواعد الإيداع، الفروع، التنسيق) |
| [`docs/ai/README.md`](docs/ai/README.md) | دليل سريع للمعمارية وأنماط الكود |
| [`docs/ai/architecture.md`](docs/ai/architecture.md) | المعمارية التفصيلية (Contexts، API Routes، etc.) |
| [`docs/ai/feature-guide.md`](docs/ai/feature-guide.md) | دليل إضافة درس أو قسم جديد |
| [`docs/testing.md`](docs/testing.md) | مرجع الاختبارات التفصيلي (55 اختبارًا) |
| [`docs/deployment.md`](docs/deployment.md) | دليل النشر الشامل (Heroku، Vercel، Railway، etc.) |

### الدروس التعليمية

| الملف | الغرض |
|-------|--------|
| [`docs/tutorials/README.md`](docs/tutorials/README.md) | فهرس الدروس ومسارات التعلم |
| [`docs/tutorials/concepts-guide.md`](docs/tutorials/concepts-guide.md) | شرح كل التقنيات من الصفر |
| [`docs/tutorials/quick-reference.md`](docs/tutorials/quick-reference.md) | جداول مرجعية سريعة |
| `docs/tutorials/server/` | 2 درس (API routes، اختبار الأخطاء) |
| `docs/tutorials/client/` | 6 دروس (الهيكل، المظهر، الحالة، المكونات، الصفحات، الاختبارات) |

### لمساعدي AI

جميع ملفات `docs/ai/` **إلزامية القراءة** قبل إجراء أي تعديل على الكود. تحتوي على:
- معمارية التطبيق ونمط Repository غير المستخدم (لا database)
- أنماط الكود الإلزامية (Context + Custom Hook)
- دليل إضافة ميزات جديدة
- متغيرات البيئة وإعدادات الإنتاج

---

## المساهمة

يُرجى قراءة [`CONTRIBUTING.md`](CONTRIBUTING.md) قبل المساهمة في المشروع. يحتوي على:

- قواعد أسماء الفروع
- صيغة رسائل الإيداع (Conventional Commits)
- استراتيجية التاجات (semantic versioning)
- قائمة التحقق قبل الإيداع
- متطلبات التوثيق

**القواعد الأساسية:**
- لا تستورد Context مباشرة — استخدم custom hooks
- جميع ثوابت التطبيق في `app/config.ts`
- جميع دوال API في `app/lib/api.ts`
- تنسيق الكود بـ Prettier قبل كل إيداع
- رسائل الإيداع بالإنجليزية فقط (Conventional Commits)

---

## الترخيص

هذا المشروع تعليمي ومفتوح المصدر. يمكنك استخدامه، تعديله، وتوزيعه بحرية.

**ملاحظة:** يتطلب استخدام OpenAI API مفتاحاً صالحاً ورصيداً كافياً. مفتاح API للاستخدام الشخصي والتطوير فقط — **لا تُودعه في Git أبداً**.

---

Made with ❤️ for Arabic-speaking English learners
