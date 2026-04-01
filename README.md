# علمني — Teach Me

منصة تعليمية تفاعلية لتعلم قواعد الإنجليزية (A2) مبنية بـ Next.js 16 وTypeScript مع OpenAI.

## نظرة سريعة

- واجهة عربية RTL مع دعم Light/Dark.
- 9 دروس، وكل درس يحتوي 4 أقسام: `lecture` و`question` و`conversation` و`translate`.
- محتوى ديناميكي بالذكاء الاصطناعي عبر GPT-4o-mini وWhisper.
- تنقل Sidebar تفاعلي: توسيع درس واحد، تمييز القسم النشط، وسلوك صحيح على الموبايل.
- عرض Markdown متعدد اللغات (عربي/إنجليزي/مختلط) مع اتجاه دلالي لكل بلوك وكود ثابت LTR.

## التقنيات

- Next.js `16.2.1` (App Router)
- React `19.2.2`
- TypeScript `5.9.x`
- MUI `7.3.x` + Emotion + RTL plugin
- OpenAI SDK `6.16.x`
- Vitest `4.0.x` + Testing Library

## المتطلبات

- Node.js `>=20.x`
- npm `>=10.x`
- متغير بيئي: `OPENAI_API_KEY`

## التشغيل المحلي

```bash
npm install
cp .env.example .env
# أضف OPENAI_API_KEY في .env
npm run dev
```

## أوامر المشروع

```bash
npm run dev
npm run build
npm start
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run test:coverage
npm run format
npm run format:check
npm run check:docker-config
npm run validate
```

## هيكل مختصر

```text
app/
├── api/                      # chat-completion, speech-to-text, text-completion, health
├── components/               # ToolBar, SideBar, Footer, MarkdownRenderer
├── context/                  # ThemeContext, AppContext
├── hooks/                    # useThemeMode, useAppContext, useAudioRecorder
├── layouts/                  # MainLayout
├── lib/                      # api.ts, apiErrors.ts
├── tests/                    # Vitest suites
├── [slug]/                   # lecture, question, conversation, translate
├── config.ts
├── styles.ts
└── types.ts
```

## API Endpoints

- `POST /api/chat-completion` body: `{ messages: ChatMessage[] }`
- `POST /api/speech-to-text` body: `FormData` with key `file`
- `POST /api/text-completion` body: `{ message: string }`
- `GET /api/health`

## الاختبارات

المشروع يحتوي حالياً على **94 اختباراً** داخل `app/tests`.

```bash
npm run test
```

مرجع التفاصيل: `docs/testing.md`.

## النشر

- راجع `docs/deployment.md` للتشغيل عبر Docker والنشر والمنهج الأمني.
- Docker image يحتوي healthcheck على `/api/health`.

## التوثيق

- `CONTRIBUTING.md`
- `docs/ai/README.md`
- `docs/ai/architecture.md`
- `docs/ai/feature-guide.md`
- `docs/testing.md`
- `docs/deployment.md`
- `docs/tutorials/README.md`

## ملاحظة أمان

لا تقم بإيداع أي مفاتيح أو ملفات `.env` في Git.
