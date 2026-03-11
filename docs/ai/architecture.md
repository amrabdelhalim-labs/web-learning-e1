# المعمارية التفصيلية — علمني (web-learning-e1)

> **📐 الدليل الشامل لبنية المشروع**
> 
> يوثّق هذا الملف جميع طبقات التطبيق، تدفق البيانات، الأنماط المعمارية، وقرارات التصميم.

---

## جدول المحتويات

1. [نظرة عامة](#1-نظرة-عامة)
2. [الطبقات المعمارية](#2-الطبقات-المعمارية)
3. [إدارة الحالة](#3-إدارة-الحالة-state-management)
4. [API Routes](#4-api-routes)
5. [الصفحات الديناميكية](#5-الصفحات-الديناميكية)
6. [المكونات](#6-المكونات-components)
7. [التصميم والثيمات](#7-التصميم-والثيمات)
8. [تدفق البيانات](#8-تدفق-البيانات)
9. [معالجة الأخطاء](#9-معالجة-الأخطاء)
10. [الأنواع (Types)](#10-الأنواع-types)

---

## 1. نظرة عامة

**علمني** تطبيق Next.js 16 مع **App Router**، يعتمد على:

- **Client-side rendering** لصفحات التفاعل (dynamic routes)
- **Server-side API Routes** للتواصل مع OpenAI
- **Context API** لإدارة الحالة العامة
- **Material-UI 7** لمكتبة المكونات مع دعم RTL
- **TypeScript strict mode** لـ type safety

**لا توجد قاعدة بيانات** — كل المحتوى مُولَّد ديناميكياً في الوقت الفعلي.

---

## 2. الطبقات المعمارية

```text
┌──────────────────────────────────────────────┐
│     UI Layer (Pages + Components)            │ ← user interaction
├──────────────────────────────────────────────┤
│       Presentation Layer (Layouts)           │ ← MainLayout, ToolBar, SideBar
├──────────────────────────────────────────────┤
│    State Management (Contexts + Hooks)       │ ← ThemeContext, AppContext
├──────────────────────────────────────────────┤
│     Business Logic (API utilities)           │ ← lib/api.ts, lib/apiErrors.ts
├──────────────────────────────────────────────┤
│       Server Layer (API Routes)              │ ← app/api/**/route.ts
├──────────────────────────────────────────────┤
│    External Services (OpenAI SDK)            │ ← GPT-4o-mini, Whisper
└──────────────────────────────────────────────┘
```

### لماذا هذه البنية؟

| الطبقة | المسؤولية | الفصل |
|--------|-----------|-------|
| **UI** | عرض البيانات، معالجة أحداث المستخدم | لا business logic في UI |
| **Presentation** | تخطيط الواجهة، التنقل | مستقلة عن data fetching |
| **State** | حالة التطبيق، الثيم | contexts + hooks فقط |
| **Business Logic** | API calls، data transformation | في `lib/` فقط |
| **Server** | التواصل مع External APIs | فقط API routes |
| **External** | OpenAI GPT + Whisper | SDK calls |

---

## 3. إدارة الحالة (State Management)

### 3.1 Context + Custom Hook Pattern

```typescript
import { ThemeContext } from '@/app/context/ThemeContext';
// ❌ الطريقة الخاطئة
import { useContext } from 'react';
const context = useContext(ThemeContext);

// ✅ الطريقة الصحيحة
import { useThemeMode } from '@/app/hooks/useThemeMode';
const { mode, toggleTheme } = useThemeMode();
```

**الفوائد:**
1. Type safety تلقائي
2. Null check مدمج في الـ hook
3. Single source of truth
4. سهولة تعديل الـ context دون تغيير استخدامه

### 3.2 ThemeContext

**الملف:** `app/context/ThemeContext.tsx`

```typescript
interface ThemeContextState {
  mode: ThemeMode;          // 'light' | 'dark'
  toggleTheme: () => void;
}
```

**المسؤوليات:**
- إدارة الوضع الليلي/النهاري
- حفظ التفضيل في **localStorage** بمفتاح `'theme-mode'`
- اكتشاف تفضيل النظام عبر `window.matchMedia('(prefers-color-scheme: dark)')`
- توفير theme objects لـ MUI `ThemeProvider`

**التخزين المحلي:**
```typescript
localStorage.setItem('theme-mode', 'dark');
const savedMode = localStorage.getItem('theme-mode');
```

**اكتشاف النظام:**
```typescript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

### 3.3 AppContext

**الملف:** `app/context/AppContext.tsx`

```typescript
interface AppContextState {
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  drawerWidth: number;
  messageValue: string;
  setMessageValue: (value: string) => void;
  contextPreviousMessage: ChatMessage[];
  setContextPreviousMessage: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  handleChatResponse: (response: ApiResponse<ChatCompletionData>, userContent: string) => boolean;
  clearMessages: () => void;
  showAlert: boolean;
  setShowAlert: (show: boolean) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  textButton: string;
  setTextButton: (text: string) => void;
  showFooterButton: boolean;
  setShowFooterButton: (show: boolean) => void;
}
```

**المسؤوليات:**
- حالة القائمة الجانبية (mobile drawer)
- رسائل المحادثة (`messages`، `contextPreviousMessage`)
- إدارة الأخطاء (`showAlert`، `errorMessage`)
- حالة footer button (`textButton`، `showFooterButton`)

### 3.4 Providers Hierarchy

**الملف:** `app/providers.tsx`

```tsx
<ThemeProviderWrapper>    {/* Theme + MUI ThemeProvider */}
  <AppProvider>           {/* App state */}
    {children}
  </AppProvider>
</ThemeProviderWrapper>
```

**القاعدة:** `ThemeProviderWrapper` في الخارج لأن `AppProvider` قد يستخدم MUI components.

---

## 4. API Routes

### 4.1 البنية

```text
app/api/
├── chat-completion/
│   └── route.ts       ← GPT-4o-mini chat completions
├── speech-to-text/
│   └── route.ts       ← Whisper audio transcription
└── text-completion/
    └── route.ts       ← Legacy text completion
```

### 4.2 chat-completion/route.ts

**المسار:** `/api/chat-completion`
**الطريقة:** `POST`

**Input:**
```typescript
{
  messages: ChatMessage[]  // [{ role: 'user', content: '...' }, ...]
}
```

**Output (نجاح):**
```typescript
{
  role: 'assistant',
  content: 'AI response...'
}
```

**التنفيذ:**
```typescript
import OpenAI from 'openai';
import { validateApiKey, handleOpenAIError } from '@/app/lib/apiErrors';
import { OPENAI_MODEL } from '@/app/config';

export async function POST(request: Request) {
  // 1. Validate API key
  const keyError = validateApiKey();
  if (keyError) return keyError;

  // 2. Parse request
  const { messages } = await request.json();

  // 3. Call OpenAI
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,    // 'gpt-4o-mini'
      messages,
    });

    return NextResponse.json({
      role: completion.choices[0].message.role,
      content: completion.choices[0].message.content,
    }, { status: 200 });

  } catch (error) {
    return handleOpenAIError(error);  // رسالة عربية حسب status code
  }
}
```

### 4.3 speech-to-text/route.ts

**المسار:** `/api/speech-to-text`
**الطريقة:** `POST`
**Content-Type:** `multipart/form-data`

**Input:**
```typescript
FormData {
  audio: File  // audio blob
}
```

**Output (نجاح):**
```typescript
{
  text: 'transcribed text...'
}
```

**التنفيذ:**
```typescript
const formData = await request.formData();
const audioFile = formData.get('audio') as File;

const transcription = await openai.audio.transcriptions.create({
  file: audioFile,
  model: 'whisper-1',
});

return NextResponse.json({ text: transcription.text }, { status: 200 });
```

### 4.4 text-completion/route.ts

**المسار:** `/api/text-completion`
**الطريقة:** `POST`

**Input:**
```typescript
{
  prompt: string
}
```

**Output (نجاح):**
```typescript
{
  text: 'completion text...'
}
```

**الاستخدام:** محدود — معظم الصفحات تستخدم `chat-completion`.

---

## 5. الصفحات الديناميكية

### 5.1 البنية

```text
app/[slug]/
├── lecture/page.tsx  // شرح القاعدة
├── question/page.tsx  // اختيار من متعدد
├── conversation/page.tsx  // تسجيل صوتي + تقييم
└── translate/page.tsx  // ترجمة EN↔AR
```

### 5.2 Slug Parameter

```typescript
export interface SlugPageParams {
  params: Promise<{ slug: string }>;
}

export default function LecturePage({ params }: SlugPageParams) {
  const { slug } = use(params);  // 'present-simple', 'past-simple', etc.
}
```

**الـ slug** يمثل اسم الدرس من `LESSONS` array في `app/config.ts`.

### 5.3 lecture/page.tsx

**المسؤولية:** شرح القاعدة النحوية بأسلوب واضح ومبسّط.

**التدفق:**
1. يُطلب من GPT-4o-mini شرح القاعدة بناءً على `slug`
2. عرض الشرح في `Paper` component
3. زر "شرح جديد" لإعادة الطلب بأسلوب مختلف

**Prompt Example:**
```typescript
const prompt: ChatMessage = {
  role: 'user',
  content: `As an English teacher for A2 students, explain "${slug}" in Arabic.

Use simple examples and clear structure.

Format:
1. Definition
2. Usage rules
3. 3 practical examples
4. Common mistakes to avoid`
};
```

### 5.4 question/page.tsx

**المسؤولية:** اختبار فهم القاعدة عبر أسئلة اختيار من متعدد.

**التدفق:**
1. طلب سؤال + 4 خيارات من GPT
2. عرض السؤال وخيارات بصيغة buttons
3. عند الاختيار: طلب تقييم الإجابة من GPT
4. عرض التقييم مع شرح الإجابة الصحيحة

**خصائص:**
- الخيارات عشوائية في كل جلسة
- GPT يولّد إجابة صحيحة واحدة + 3 إجابات خاطئة معقولة
- التقييم يشرح **لماذا** الإجابة صحيحة/خاطئة

### 5.5 conversation/page.tsx

**المسؤولية:** تقييم نطق الجمل الإنجليزية.

**التدفق:**
1. طلب جملة إنجليزية بسيطة من GPT
2. عرض الجملة
3. المستخدم يسجل صوته عبر **useAudioRecorder** hook
4. إرسال الصوت إلى `/api/speech-to-text`
5. مقارنة النص المُتعرَّف عليه مع الجملة الأصلية عبر GPT
6. عرض تقييم النطق

**تسجيل الصوت (cross-platform):**
```typescript
import { useAudioRecorder } from '@/app/hooks/useAudioRecorder';

// يكتشف تلقائيًا أفضل MIME type (WebM → MP4 → OGG)
const { status, mediaBlobUrl, startRecording, stopRecording, clearBlobUrl, isSupported, error } = useAudioRecorder();
```

**توافق الأجهزة:**
- Chrome/Firefox: `audio/webm;codecs=opus`
- Safari/iOS: `audio/mp4`
- الخطاف يعالج أذونات الميكروفون ويعرض رسائل خطأ بالعربية

### 5.6 translate/page.tsx

**المسؤولية:** ترجمة EN↔AR مع تقييم الدقة.

**الميزات الخاصة:**
- **تبديل اتجاه الترجمة** عبر زر `SwapHorizIcon`
- حالتان: إنجليزي→عربي أو عربي→إنجليزي
- GPT يولّد جملة بناءً على الاتجاه المختار
- المستخدم يُدخل ترجمته
- GPT يُقيّم الترجمة ويُقدّم ملاحظات

**الحالة:**
```typescript
const [isEnglishToArabic, setIsEnglishToArabic] = useState(true);

const toggleDirection = () => {
  const newDirection = !isEnglishToArabic;
  setIsEnglishToArabic(newDirection);
  getSentence(newDirection);  // إعادة الطلب بالاتجاه الجديد
};
```

---

## 6. المكونات (Components)

### 6.1 ToolBar

**الملف:** `app/components/ToolBar/ToolBar.tsx`

**المسؤوليات:**
- عرض اسم التطبيق (`APP_NAME`) مع أيقونة `AutoStoriesIcon`
- زر تبديل الثيم (dark/light mode)
- زر فتح القائمة الجانبية (mobile)

**التأثيرات:**
- Glass-morphism: `backdropFilter: 'blur(8px)'`
- Gradient على اسم التطبيق

**الزر الثيم:**
```tsx
<Tooltip title={mode === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}>
  <IconButton onClick={toggleTheme} color="inherit">
    {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
  </IconButton>
</Tooltip>
```

### 6.2 SideBar

**الملف:** `app/components/SideBar/SideBar.tsx`

**المسؤوليات:**
- عرض قائمة الدروس من `LESSONS`
- كل درس له 4 أقسام (lecture، question، conversation، translate)
- دعم Drawer للـ mobile و Permanent للـ desktop

**البنية:**
```tsx
<Drawer>
  <MenuToolbar />        {/* اسم التطبيق + أيقونة */}
  <List>
    {LESSONS.map((lesson) => (
      <CustomizedListItem lesson={lesson} />
    ))}
  </List>
  <MenuFooter />         {/* AI icon */}
</Drawer>
```

### 6.3 CustomizedListItem

**الملف:** `app/components/SideBar/CustomizedListItem.tsx`

**المسؤوليات:**
- عرض اسم الدرس
- قائمة منسدلة بـ 4 أقسام (lecture، question، conversation، translate)
- أيقونة مختلفة لكل قسم

**الأيقونات:**
```typescript
const iconMap = {
  MenuBook: MenuBookIcon,
  Quiz: QuizIcon,
  RecordVoiceOver: RecordVoiceOverIcon,
  Translate: TranslateIcon,
};
```

### 6.4 Footer

**الملف:** `app/components/Footer/Footer.tsx`

**المسؤوليات:**
- حقل "اسألني" — إرسال سؤال حر للذكاء الاصطناعي
- زر إجراء مخصص (`textButton`)

**تدفق "اسألني":**
1. المستخدم يكتب سؤالاً في حقل "اسألني"
2. عند الإرسال: `setMessageValue(value)` + `router.push('/')`
3. الصفحة الرئيسية تستقبل `messageValue` وترسله مع `ASK_ME_SYSTEM_PROMPT` إلى OpenAI
4. الرد يُعرض عبر `MarkdownRenderer`

### 6.5 MarkdownRenderer

**الملف:** `app/components/MarkdownRenderer.tsx`

**المسؤوليات:**
- تحويل نص Markdown من ردود الذكاء الاصطناعي إلى عناصر React/MUI
- دعم: عناوين، قوائم، خط عريض، كود (inline + block)، جداول، اقتباسات
- متوافق مع RTL والوضع الليلي/النهاري
- يقبل `color` prop لتخصيص لون النص حسب القسم

**Props:**
```typescript
interface MarkdownRendererProps {
  content: string;   // نص Markdown
  color?: string;    // لون مخصص للنص (اختياري)
}
```

**الاعتماديات:** `react-markdown` + `remark-gfm`

**الاستخدام في جميع الصفحات:**
- الصفحة الرئيسية (ردود "اسألني")
- صفحة الشرح (شرح القاعدة)
- صفحة الأسئلة (تقييم الإجابات)
- صفحة المحادثة (تقييم النطق)
- صفحة الترجمة (تقييم الترجمة)

### 6.6 MainLayout

**الملف:** `app/layouts/MainLayout.tsx`

**المسؤوليات:**
- Layout مشترك لجميع صفحات المحتوى
- إدارة ToolBar + SideBar + Footer
- عرض Snackbar للأخطاء
- حالة التحميل (`loading`) مع نص عشوائي

**Props:**
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  onButtonClick?: () => void;
}
```

**البنية:**
```tsx
<Box display="flex">
  <ToolBar />
  <SideBar />
  <Box component="main" flexGrow={1}>
    <Fade in={!loading}>
      {children}
    </Fade>
    {loading && <CircularProgress />}
  </Box>
  <Footer />
  <Snackbar open={showAlert} message={errorMessage} />
</Box>
```

---

## 7. التصميم والثيمات

### 7.1 Material-UI Theme

**الملف:** `app/context/ThemeContext.tsx`

```typescript
const createAppTheme = (mode: ThemeMode): Theme =>
  createTheme({
    direction: 'rtl',
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1565c0' : '#90caf9',
      },
    },
  }, arSA);
```

**المكونات:**
- `direction: 'rtl'` — دعم RTL عربي
- `arSA` — locale عربي من MUI
- ألوان مخصصة لكل وضع

### 7.2 RTL Support

**المكتبات:**
```typescript
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});
```

**CacheProvider:**
```tsx
<CacheProvider value={cacheRtl}>
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
</CacheProvider>
```

### 7.3 CSS Variables (globals.css)

**للضوء:**
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

**للظلام:**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --shadow-sm: 0 1px 2px 0 rgb(255 255 255 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(255 255 255 / 0.1);
  }
}
```

---

### 7.4 التنسيقات المركزية (Centralized Styles)

**الملف:** `app/styles.ts`

ملف مركزي يحتوي على:
- **ألوان الأقسام** (`sectionColors`) — ثلاث لوحات ألوان: أخضر (إجابات)، بنفسجي (أسئلة)، أزرق (شرح)
- **أنماط Paper** — دوال جاهزة (`answerPaperSx`، `questionPaperSx`، `lecturePaperSx`، `neutralPaperSx`)
- **ثوابت** — `CONTENT_BOTTOM_MARGIN`، `paperBase`

**الفائدة:** يمنع تكرار ألوان الداكن/الفاتح عبر الصفحات ويضمن تناسق التصميم.

---

## 8. تدفق البيانات

### 8.1 Chat Completion Flow

```text
┌─────────────┐
│    Page     │ (lecture, question, translate)
└──────┬──────┘
       │ getChatCompletion([messages])
       ↓
┌─────────────┐
│ lib/api.ts  │
└──────┬──────┘
       │ POST /api/chat-completion
       ↓
┌─────────────┐
│  API Route  │ (app/api/chat-completion/route.ts)
└──────┬──────┘
       │ validateApiKey()
       │ openai.chat.completions.create()
       ↓
┌─────────────┐
│ OpenAI API  │ (GPT-4o-mini)
└──────┬──────┘
       │ { role, content }
       ↓
┌─────────────┐
│  API Route  │
└──────┬──────┘
       │ return { role, content }, status: 200
       ↓
┌─────────────┐
│    Page     │ update UI
└─────────────┘
```

### 8.2 Speech-to-Text Flow

```text
┌─────────────┐
│ conversation│ (user records audio)
│   page.tsx  │
└──────┬──────┘
       │ mediaBlobUrl
       │ getTranscription(blobUrl)
       ↓
┌─────────────┐
│ lib/api.ts  │ fetch(blobUrl) → File
└──────┬──────┘
       │ POST /api/speech-to-text (FormData)
       ↓
┌─────────────┐
│  API Route  │ (app/api/speech-to-text/route.ts)
└──────┬──────┘
       │ openai.audio.transcriptions.create()
       ↓
┌─────────────┐
│ Whisper API │
└──────┬──────┘
       │ { text }
       ↓
┌─────────────┐
│  API Route  │
└──────┬──────┘
       │ return { text }, status: 200
       ↓
┌─────────────┐
│ conversation│ display + evaluate pronunciation
│   page.tsx  │
└─────────────┘
```

---

## 9. معالجة الأخطاء

### 9.1 validateApiKey()

**الملف:** `app/lib/apiErrors.ts`

```typescript
export function validateApiKey(): NextResponse | null {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'مفتاح API غير موجود في متغيرات البيئة' },
      { status: 500 }
    );
  }
  return null;
}
```

### 9.2 handleOpenAIError()

**رسائل عربية حسب status code:**

| Code | الرسالة |
|------|---------|
| `401` | "مفتاح API غير صحيح. تحقق من إعداد OPENAI_API_KEY" |
| `429` | "تجاوزت الحد المسموح من الطلبات. انتظر قليلاً" |
| `500` | "خطأ في الخادم. حاول مرة أخرى لاحقاً" |
| `503` | "الخدمة غير متاحة حالياً. حاول لاحقاً" |
| other | "حدث خطأ غير متوقع" |

---

## 10. الأنواع (Types)

**الملف:** `app/types.ts`

### الأنواع الرئيسية

```typescript
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: MessageRole;
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

export interface TextCompletionData {
  text: string;
}

export interface TranscriptionData {
  text: string;
}

export type ThemeMode = 'light' | 'dark';

export interface LessonItem {
  slug: string;
  nameAr: string;
}

export type LessonSection = 'lecture' | 'question' | 'conversation' | 'translate';

export interface LessonSectionItem {
  key: LessonSection;
  nameAr: string;
  icon: string;
}

export interface SlugPageParams {
  params: Promise<{ slug: string }>;
}
```

---

## الخلاصة

المعمارية مصممة لتكون:
- **بسيطة:** لا complexity غير ضروري
- **واضحة:** كل طبقة لها مسؤولية محددة
- **قابلة للتوسع:** إضافة درس جديد = تعديل `config.ts` فقط
- **آمنة:** API keys في server-side فقط
- **متناسقة:** أنماط موحدة عبر جميع الملفات

راجع [`feature-guide.md`](feature-guide.md) لدليل إضافة ميزات جديدة.
