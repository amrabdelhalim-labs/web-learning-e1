# الدرس الرابع: المكونات الأساسية

## الهدف

فهم أدوار مكونات الواجهة الأساسية في الوضع الحالي للمشروع.

## المكونات الرئيسية

- `ToolBar`: زر القائمة للموبايل + تبديل الثيم.
- `SideBar`: قائمة الدروس مع Drawer مؤقت للموبايل ودائم للديسكتوب.
- `CustomizedListItem`: صف الدرس + قائمة الأقسام الفرعية.
- `Footer`: حقل "اسألني" والإرسال.
- `MainLayout`: يجمع ToolBar + SideBar + المحتوى + Footer + Snackbar.

## Sidebar Behavior (Current)

مصدر السلوك:

- `app/components/SideBar/SideBar.tsx`
- `app/components/SideBar/CustomizedListItem.tsx`

القواعد:

- درس واحد فقط يكون expanded.
- التوسيع مملوك في `SideBar` وليس داخل كل عنصر.
- التوسيع route-aware عبر `usePathname`.
- submenu clicks لا تُمرَّر للصف الأب (`stopPropagation`).
- في الموبايل يتم إغلاق Drawer بعد اختيار submenu.
- قائمة الدروس scrollable والـ footer داخل normal flow (لا overlay click-through).
