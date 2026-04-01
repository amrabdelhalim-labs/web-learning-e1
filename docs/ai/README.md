# AI Working Guide — web-learning-e1

هذا الملف مرجع سريع لأي مساعد AI يعمل على المشروع.

## Read First

1. `docs/ai/architecture.md`
2. `docs/ai/feature-guide.md`
3. `README.md`
4. `CONTRIBUTING.md`

## Project Facts (Current)

- Next.js App Router project (single package).
- لا قاعدة بيانات.
- API routes:
  - `POST /api/chat-completion`
  - `POST /api/speech-to-text`
  - `POST /api/text-completion`
  - `GET /api/health`
- Sidebar behavior:
  - controlled expansion from `SideBar`
  - one lesson expanded at a time
  - route-aware expansion
  - submenu click closes mobile drawer

## Mandatory Patterns

- Context access via hooks only: `useThemeMode`, `useAppContext`.
- API calls from `app/lib/api.ts`.
- Shared constants in `app/config.ts`.
- Shared types in `app/types.ts`.
- Shared UI tokens in `app/styles.ts`.

## Guardrails

- لا تخلط expansion state مع selected route state في Sidebar.
- أي تعديل سلوكي يجب أن يصاحبه اختبار regression في `app/tests`.
- حافظ على payload contracts الحالية:
  - `text-completion` يستخدم `message` وليس `prompt`
  - `speech-to-text` يستقبل `file` في `FormData`

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
