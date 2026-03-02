# توثيقات تعليمية — مشروع علمني 📖

> شروحات تفصيلية بأسلوب تعليمي لجميع ملفات المشروع ومعماريته

---

## لمحة عن المشروع

**علمني** = منصة تعليمية ذكية لتعلم اللغة الإنجليزية للناطقين بالعربية (مستوى A2)

| الجانب | التقنية |
|--------|---------|
| الإطار | Next.js 16 (App Router) |
| اللغة | TypeScript 5.9 (strict mode) |
| واجهة المستخدم | MUI 7 (Material UI) + Emotion |
| دعم RTL | @mui/stylis-plugin-rtl + stylis |
| الذكاء الاصطناعي | OpenAI SDK 6 (GPT-4o-mini + Whisper) |
| مسارات API | Next.js Route Handlers |
| إدارة الحالة | React Context + Custom Hooks |
| المظهر | Dark/Light Mode مع تخزين محلي |

---

## فهرس الدروس

### الخادم (Server — API Routes)

| # | الملف | الموضوع |
|---|-------|---------|
| 1 | [01-api-routes.md](./server/01-api-routes.md) | مسارات API — OpenAI + معالجة الأخطاء |
| 2 | [02-testing.md](./server/02-testing.md) | اختبارات جانب الخادم |

### العميل (Client)

| # | الملف | الموضوع |
|---|-------|---------|
| 1 | [01-app-structure.md](./client/01-app-structure.md) | هيكل التطبيق والتهيئة والأنواع |
| 2 | [02-theme-system.md](./client/02-theme-system.md) | نظام المظهر — Dark/Light + RTL + MUI |
| 3 | [03-state-management.md](./client/03-state-management.md) | إدارة الحالة — Context + Custom Hooks |
| 4 | [04-components.md](./client/04-components.md) | المكونات — ToolBar + SideBar + Footer + MainLayout |
| 5 | [05-dynamic-pages.md](./client/05-dynamic-pages.md) | الصفحات الديناميكية — شرح، أسئلة، محادثة، ترجمة |
| 6 | [06-testing.md](./client/06-testing.md) | اختبارات العميل — Vitest + Testing Library |

### المراجع

| الملف | الغرض |
|-------|--------|
| [concepts-guide.md](./concepts-guide.md) | شرح كل التقنيات والمفاهيم من الصفر |
| [quick-reference.md](./quick-reference.md) | خريطة التعلم والمرجع السريع |

---

## مسار التعلم المقترح

### 🎯 للمبتدئين (ابدأ من هنا)

```
concepts-guide.md → لفهم التقنيات الأساسية
        │
        ▼
client/01-app-structure.md → بنية المشروع
        │
        ▼
client/02-theme-system.md → نظام المظهر
        │
        ▼
client/03-state-management.md → إدارة الحالة
        │
        ▼
server/01-api-routes.md → كيف يتواصل التطبيق مع الذكاء الاصطناعي
        │
        ▼
client/04-components.md → المكونات الأساسية
        │
        ▼
client/05-dynamic-pages.md → صفحات التعلم
```

### 🧪 لمن يريد فهم الاختبارات

```
server/02-testing.md → اختبارات معالجة الأخطاء
        │
        ▼
client/06-testing.md → اختبارات العميل (Vitest)
```

### 🔧 للمطورين المتقدمين

```
quick-reference.md → كل الأوامر والأنماط بلمحة
        │
        ▼
server/01-api-routes.md + client/03-state-management.md
        │
        ▼
client/05-dynamic-pages.md → التنفيذ المتقدم
```

---

*جميع الشروحات بالعربية — أسماء الملفات بالإنجليزية*
