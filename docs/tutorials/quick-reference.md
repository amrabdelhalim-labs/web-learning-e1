# المرجع السريع — علمني

## أوامر يومية

- `npm run dev`
- `npm run test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run validate`

## أهم المسارات

- `/`
- `/[slug]/lecture`
- `/[slug]/question`
- `/[slug]/conversation`
- `/[slug]/translate`

## API Routes

- `POST /api/chat-completion` with `{ messages }`
- `POST /api/speech-to-text` with `FormData(file)`
- `POST /api/text-completion` with `{ message }`
- `GET /api/health`

## ملفات مرجعية

- `app/config.ts` (LESSONS, LESSON_SECTIONS, prompts/constants)
- `app/types.ts` (contracts)
- `app/lib/api.ts` (client API adapter)
- `app/components/SideBar/SideBar.tsx` (expansion ownership)
- `app/components/SideBar/CustomizedListItem.tsx` (submenu actions)
- `app/tests/lessonSidebarInteraction.test.tsx` (sidebar regression tests)

## قواعد مختصرة

- لا `fetch` مباشر في الصفحات.
- لا import مباشر للـ Context.
- أي سلوك جديد => اختبار regression + تحديث docs.
