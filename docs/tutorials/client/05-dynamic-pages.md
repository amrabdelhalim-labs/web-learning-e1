# الدرس الخامس: الصفحات الديناميكية

## الهدف

فهم صفحات `app/[slug]` وكيف تستخدم طبقة API المشتركة.

## الصفحات

- `app/[slug]/lecture/page.tsx`
- `app/[slug]/question/page.tsx`
- `app/[slug]/conversation/page.tsx`
- `app/[slug]/translate/page.tsx`

## نمط عام

- كل صفحة تعتمد `MainLayout`.
- `slug` يؤخذ من params الديناميكية.
- التواصل مع الخادم عبر `app/lib/api.ts`.
- نصوص التحميل من `getRandomLoadingText`.

## API Usage by Section

- `lecture` و`question`: `getChatCompletion`.
- `conversation`: `getTranscription` ثم تقييم عبر `getChatCompletion`.
- `translate`: `getTextCompletion` + تقييم عبر `getChatCompletion`.

## Sidebar Integration

عند التنقل بين `/${slug}/${section}`:

- يتم تحديث تمييز القسم النشط في القائمة.
- يتم توسيع الدرس الحالي تلقائياً في Sidebar.
