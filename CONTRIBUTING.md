# دليل المساهمة — علمني (web-learning-e1)

> **اقرأ هذا الملف قبل إجراء أي تغيير.**
> هذه القواعد غير قابلة للتفاوض وتُطبَّق عند مراجعة الكود. أي انحراف يتطلب مبرراً صريحاً.

---

## 1. المعمارية أولاً

قبل كتابة أي كود، اقرأ توثيق توجيهات AI:

| الملف | اقرأه عند |
|-------|---------|
| [`docs/ai/README.md`](docs/ai/README.md) | دائماً — ابدأ من هنا |
| [`docs/ai/architecture.md`](docs/ai/architecture.md) | إجراء أي تغيير في البنية |
| [`docs/ai/feature-guide.md`](docs/ai/feature-guide.md) | إضافة درس أو ميزة جديدة |

**ملخص القواعد الحرجة (القائمة الكاملة في `docs/ai/README.md`):**
- الوصول للثيم عبر `useThemeMode()` hook — لا `useContext(ThemeContext)` مباشرة
- الوصول لحالة التطبيق عبر `useAppContext()` hook — لا direct context import
- جميع دوال API في `app/lib/api.ts` — لا fetch calls inline في الصفحات
- استخدم الأنواع المُعرَّفة في `app/types.ts` — لا inline type definitions
- جميع الثوابت في `app/config.ts` — لا hardcoded strings/numbers منتشرة- جميع التنسيقات المشتركة في `app/styles.ts` — لا تكرار fontSize/padding في الصفحات
- تسجيل الصوت عبر `useAudioRecorder` hook — لا مكتبات خارجية للتسجيل- دوال معالجة الأخطاء في `app/lib/apiErrors.ts` — رسائل عربية موحَّدة
- استخدم `MainLayout` wrapper لجميع صفحات المحتوى — ليس custom layout code
- الأيقونات من `@mui/icons-material` — لا صور خارجية إلا للضرورة القصوى

---

## 2. أسماء الفروع

```
main             ← كود جاهز للإنتاج فقط؛ لا تُودِع مباشرة
feat/<topic>     ← ميزة جديدة (مثال: feat/dark-mode)
fix/<topic>      ← إصلاح خطأ (مثال: fix/audio-recording)
docs/<topic>     ← توثيق فقط (مثال: docs/update-architecture)
chore/<topic>    ← أدوات، اعتماديات، إعداد (مثال: chore/update-prettier)
refactor/<topic> ← إعادة هيكلة بدون تغيير في السلوك
```

---

## 3. رسائل الإيداع (Commit Messages)

**الصيغة:** [Conventional Commits](https://www.conventionalcommits.org/) — **بالإنجليزية فقط**.

```
<type>(<scope>): <short description>

<body — list of changes, one per line starting with ->

<footer — breaking changes or issue references>
```

### الأنواع (Types)

| النوع | متى تستخدمه |
|-------|------------|
| `feat` | ميزة أو سلوك جديد |
| `fix` | إصلاح خطأ |
| `docs` | تغييرات في التوثيق فقط |
| `test` | إضافة أو تحديث اختبارات |
| `refactor` | إعادة هيكلة بدون تغيير في السلوك |
| `chore` | أدوات، إعداد، اعتماديات، CI |
| `style` | تنسيق فقط (بدون تغيير منطقي) |

### النطاقات (Scopes)

| النطاق | ينطبق على |
|--------|----------|
| `app` | مجلد `app/` (المكونات، الصفحات، السياق) |
| `api` | `app/api/` (API routes) |
| `docs` | مجلد `docs/` |
| `ai` | `docs/ai/` تحديداً |

### قواعد الإيداع

1. **سطر الموضوع ≤ 72 حرفاً**
2. **الموضوع يستخدم صيغة الأمر** — "add"، "fix"، "update"، ليس "added"، "fixed"
3. **لا نقطة في نهاية سطر الموضوع**
4. **النص الأساسي إلزامي للإيداعات غير التافهة** — اذكر كل تغيير مهم
5. **افصل الموضوع عن النص بسطر فارغ**
6. **تغيير منطقي واحد لكل إيداع** — لا تخلط app + docs في إيداع واحد

### أمثلة

```bash
# ✅ صحيح
git commit -m "feat(app): add dark mode theme support

- Create ThemeContext with light/dark toggle
- Add useThemeMode hook with localStorage persistence
- Implement theme toggle button in ToolBar
- Add system preference detection on mount
- Update globals.css with dark theme CSS variables"

# ✅ صحيح (patch)
git commit -m "fix(api): handle OpenAI rate limit errors

- Add 429 status code handling in apiErrors.ts
- Return Arabic error message for rate limits"

# ✅ صحيح (توثيق فقط)
git commit -m "docs(ai): update feature guide with theme pattern"

# ❌ خاطئ — موضوع عربي
git commit -m "إضافة الوضع الليلي"

# ❌ خاطئ — نطاق مختلط
git commit -m "feat: add dark mode and API fixes"

# ❌ خاطئ — لا نص في إيداع غير تافه
git commit -m "feat(app): add dark mode"

# ❌ خاطئ — صيغة الماضي
git commit -m "feat(app): added dark mode"
```

---

## 4. استراتيجية التاجات (Tagging Strategy)

تُحدِّد التاجات **معالم الإصدار المهمة** — ليس كل إيداع.

### متى تنشئ تاجاً

| رفع الإصدار | المحفّز |
|------------|---------|
| `v1.0.0` (major) | أول إصدار جاهز للإنتاج، أو تغيير جذري (breaking change) |
| `v1.X.0` (minor) | ميزة جديدة مكتملة (درس جديد، وضع ليلي، etc.) |
| `v1.X.Y` (patch) | إصلاح توثيق، إصلاح خطأ، أو تصحيح ثانوي |

**لا تضع تاجاً أبداً على:**
- إيداعات في منتصف العمل (work-in-progress)
- إيداعات بها أخطاء TypeScript
- إيداعات من نوع "Finished: X page"
- كل إيداع في فرع الميزة

### صيغة التاج — annotated tags حصراً

```bash
# تاج موصوف (استخدم دائماً -a — لا lightweight tags)
git tag -a v1.2.0 -m "v1.2.0 - Add Dark Mode Theme

- ThemeContext with light/dark toggle and system preference detection
- useThemeMode custom hook
- Theme toggle button in AppBar with glass-morphism styling
- CSS variables for dark theme in globals.css
- localStorage persistence with 'theme-mode' key"

# تاج على إيداع سابق
git tag -a v1.0.0 <hash> -m "v1.0.0 - ..."

# رفع التاج إلى GitHub
git push origin v1.2.0
```

### قواعد رسالة التاج

1. **السطر الأول:** `vX.Y.Z - عنوان بشري واضح`
2. **النص:** قائمة بأهم التغييرات
3. **بالإنجليزية فقط**

---

## 5. تنسيق الكود

**جميع الكود منسّق بـ Prettier** قبل كل إيداع. لا قرارات مسافات يدوية.

```bash
# تنسيق جميع الملفات (من جذر المشروع — يعمل على جميع الأنظمة)
node format.mjs

# التحقق بدون كتابة (CI — يخرج 1 إذا كان غير منسّق)
node format.mjs --check

# أو عبر npm:
npm run format
npm run format:check
```

**إعداد Prettier** (`.prettierrc.json`):
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**القواعد:**
- مسافة بادئة 2 فراغ — دائماً، لا tabs
- علامات اقتباس مفردة للسلاسل النصية
- فواصل trailing في الهياكل متعددة الأسطر (متوافق مع ES5)
- أقصى عرض للسطر: 100 حرف
- LF line endings على جميع الأنظمة (مُفرَض عبر `.gitattributes`)
- لا تُعدِّل المسافات يدوياً — دع Prettier يقرر

---

## 6. قائمة التحقق قبل الإيداع

شغّل هذا قبل كل `git commit`:

```bash
# 1. فحص TypeScript
npx tsc --noEmit

# 2. Prettier — تأكد من تطبيق التنسيق
node format.mjs --check

# 3. الاختبارات
npm test

# 4. بناء الإنتاج (للتأكد من عدم وجود أخطاء بيئة الإنتاج)
npm run build
```

**يجب أن ينجح كل ما سبق قبل الإيداع.** إيداع بأخطاء تجميع أو اختبارات فاشلة يجب ألا يصل إلى `main`.

---

## 7. تحديثات التوثيق

عند إضافة ميزة أو تغييرها:

| نوع التغيير | تحديثات التوثيق المطلوبة |
|------------|------------------------|
| درس جديد | `app/config.ts` (LESSONS array)، `docs/ai/feature-guide.md` |
| قسم جديد (lecture/question/etc) | `app/config.ts` (LESSON_SECTIONS)، `docs/ai/feature-guide.md` |
| API route جديد | `docs/ai/architecture.md` (قسم API Routes) |
| متغير بيئة جديد | `docs/ai/README.md` (قسم المتغيرات)، `README.md`، `.env.example` |
| context أو hook جديد | `docs/ai/architecture.md` (State Management) |

**إيداعات التوثيق يجب أن تكون منفصلة عن إيداعات الكود** (استخدم النوع `docs`).

---

## 8. الاختبارات

يستخدم المشروع **Vitest 4.x** مع **@testing-library/react** و **jsdom**.

### الإحصائيات

| المعيار | القيمة |
|---------|--------|
| **إجمالي الاختبارات** | 87 |
| **ملفات الاختبار** | 8 |
| **إطار الاختبار** | Vitest 4.x |
| **بيئة DOM** | jsdom |

### ملفات الاختبار

| الملف | عدد الاختبارات | الوصف |
|-------|---------------|-------|
| `config.test.ts` | 18 | ثوابت التطبيق والدروس |
| `types.test.ts` | 14 | أشكال الأنواع والواجهات |
| `api.test.ts` | 8 | دوال API مع محاكاة fetch |
| `apiErrors.test.ts` | 8 | معالجة أخطاء OpenAI |
| `useThemeMode.test.tsx` | 3 | خطاف المظهر |
| `useAppContext.test.tsx` | 4 | خطاف حالة التطبيق |
| `styles.test.ts` | 19 | التنسيقات المركزية (fontSize, paperBase, sectionColors) |
| `useAudioRecorder.test.ts` | 6 | خطاف التسجيل الصوتي |

### أوامر التشغيل

```bash
# تشغيل الاختبارات (مرة واحدة)
npm test

# وضع المراقبة (أثناء التطوير)
npm run test:watch

# تقرير التغطية
npm run test:coverage
```

### قواعد الاختبارات

1. **ملفات الاختبار** في مجلد `app/__tests__/` بلاحقة `.test.ts` أو `.test.tsx`
2. **اسم الملف** يطابق اسم الملف المُختبَر (مثال: `config.ts` → `config.test.ts`)
3. **المحاكاة** — استخدم `vi.fn()` لمحاكاة الدوال و `vi.mock()` لمحاكاة الوحدات
4. **كل اختبار مستقل** — استخدم `beforeEach` لتنظيف الحالة
5. **تأكد من نجاح الاختبارات** قبل كل إيداع (`npm test`)

---

## 9. هيكل المشروع

```
web-learning-e1/
├── app/                    # مجلد Next.js App Router
│   ├── types.ts            # جميع تعريفات الأنواع
│   ├── config.ts           # ثوابت التطبيق (LESSONS، LESSON_SECTIONS، etc.)
│   ├── globals.css         # CSS عام مع متغيرات الثيم
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # الصفحة الرئيسية
│   ├── providers.tsx       # Context providers wrapper
│   ├── context/            # React contexts
│   │   ├── ThemeContext.tsx
│   │   └── AppContext.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useThemeMode.ts
│   │   └── useAppContext.ts
│   ├── lib/                # Utility functions
│   │   ├── api.ts          # Client-side API calls
│   │   └── apiErrors.ts    # Error handling
│   ├── components/         # React components
│   │   ├── ToolBar/
│   │   ├── SideBar/
│   │   └── Footer/
│   ├── layouts/            # Layout components
│   │   └── MainLayout.tsx
│   ├── api/                # API Routes
│   │   ├── chat-completion/
│   │   ├── speech-to-text/
│   │   └── text-completion/
│   └── [slug]/             # Dynamic routes
│       ├── lecture/
│       ├── question/
│       ├── conversation/
│       └── translate/
├── docs/                   # Documentation
│   └── ai/                 # AI assistant guidelines
│       ├── README.md
│       ├── architecture.md
│       └── feature-guide.md
├── public/                 # Static assets
├── .env                    # Environment variables (NOT committed)
├── .env.example            # Environment variables template
├── .prettierrc.json        # Prettier configuration
├── .prettierignore         # Prettier ignore patterns
├── .gitattributes          # Git line ending enforcement
├── format.mjs              # Cross-platform formatter script
├── tsconfig.json           # TypeScript configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
└── CONTRIBUTING.md         # هذا الملف
```
