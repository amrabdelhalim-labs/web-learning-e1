# الدرس الأول: API Routes في علمني

## الهدف

فهم عقود المسارات الخلفية الفعلية المستخدمة حالياً في المشروع.

## المسارات الحالية

### `POST /api/chat-completion`

- Input: `{ messages: ChatMessage[] }`
- Output: كائن رسالة OpenAI يحتوي `role` و`content`.
- ملف التنفيذ: `app/api/chat-completion/route.ts`

### `POST /api/speech-to-text`

- Input: `FormData` بمفتاح `file`.
- Output: نتيجة transcription (تتضمن `text`).
- ملف التنفيذ: `app/api/speech-to-text/route.ts`

### `POST /api/text-completion`

- Input: `{ message: string }`
- Output: `{ text: string | null }`
- ملف التنفيذ: `app/api/text-completion/route.ts`

### `GET /api/health`

- Output: `{ status, service, timestamp }`
- ملف التنفيذ: `app/api/health/route.ts`

## نمط الأخطاء

كل Route يستخدم:

- `validateApiKey()`
- `handleOpenAIError()`

من: `app/lib/apiErrors.ts`.

## نقطة مهمة

تأكد دائماً أن أمثلة المستندات تطابق العقود الفعلية في الملفات أعلاه:

- `text-completion` => `message` (وليس `prompt`)
- `speech-to-text` => `file` (وليس `audio`)
