# Contributing Guide — web-learning-e1

## Scope

هذه القواعد للمساهمة في مشروع `web-learning-e1` فقط.

## Architecture Rules

- استخدم `useThemeMode()` و`useAppContext()` بدل استيراد الـ Context مباشرة.
- لا تضع `fetch` داخل الصفحات؛ استخدم `app/lib/api.ts`.
- اجعل الثوابت في `app/config.ts` والأنواع في `app/types.ts`.
- أي تغييرات UI كبيرة في الدروس يجب أن تمر عبر `MainLayout`.
- أي سلوك جديد في Sidebar يجب أن يحافظ على:
  - درس واحد موسع في كل مرة
  - فصل واضح بين التوسيع والاختيار/المسار
  - إغلاق Drawer على الموبايل بعد اختيار عنصر فرعي

## Code Style

- Prettier + ESLint هما المصدر الرسمي للتنسيق.
- استخدم سطور قصيرة ووظائف واضحة.
- لا تضف مكتبات بدون سبب واضح.

## Validation Before Commit

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

> إذا كنت تعمل على Docker/CI أيضاً شغّل:
>
> `npm run check:docker-config`

## Testing Rules

- ملفات الاختبار في `app/tests`.
- صيغة الأسماء: `*.test.ts` أو `*.test.tsx`.
- عند تعديل behavior، أضف/حدّث اختبار regression.
- الحالة الحالية: `94` اختبار (قد تتغير مع التطوير).

## Commit Style

استخدم Conventional Commits بالإنجليزية:

- `feat(app): ...`
- `fix(app): ...`
- `docs: ...`
- `test: ...`
- `refactor(app): ...`
- `chore: ...`

## Tagging

- استخدم annotated tags فقط: `git tag -a <tag> -m "<message>"`.
- اختر أسماء واضحة مرتبطة بالإصدار أو الهدف (مثال: توثيق، release، hotfix).

## Documentation Responsibility

أي تغيير سلوكي في الكود يجب أن يحدّث التوثيق المرتبط في نفس PR/commit cycle:

- `README.md`
- `docs/testing.md`
- `docs/deployment.md` (إذا تغيّر السلوك التشغيلي)
- `docs/ai/*` (إذا تغيّرت أنماط التنفيذ)
