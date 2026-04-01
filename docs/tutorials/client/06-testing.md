# الدرس السادس: اختبارات العميل

## الهدف

فهم طريقة اختبار Hooks ومكونات الواجهة وسلوك التنقل.

## أين توجد الاختبارات؟

`app/tests`

أهم الملفات للعميل:

- `useThemeMode.test.tsx`
- `useAppContext.test.tsx`
- `useAudioRecorder.test.ts`
- `styles.test.ts`
- `lessonSidebarInteraction.test.tsx`

## ملاحظات مهمة

- نستخدم `jsdom` + Testing Library.
- نُحاكي Next navigation APIs عند اختبار التنقل.
- اختبارات Sidebar تغطي:
  - توسيع درس واحد فقط
  - صحة استهداف submenu
  - استقرار التفاعل بعد عدة نقرات
  - بقاء الصفوف التالية قابلة للنقر (منع overlay bugs)

## تشغيل

```bash
npm run test
npm run test:watch
```
