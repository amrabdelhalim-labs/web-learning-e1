# الدرس الرابع: المكونات — ToolBar و SideBar و Footer و MainLayout 🧩

> **هدف الدرس:** فهم كيفية بناء مكونات واجهة المستخدم الرئيسية التي تشكل الهيكل المرئي للتطبيق

---

## 1. خريطة المكونات

تخيل أن التطبيق مثل **صحيفة يومية**: شريط العنوان (ToolBar) في الأعلى، الفهرس (SideBar) على الجانب، المحتوى في الوسط، ومربع البحث (Footer) في الأسفل.

```
┌────────────────────────────────────────────┐
│  ToolBar  [≡ قائمة]  علمني  [🌙/☀️ مظهر]  │
├──────────┬─────────────────────────────────┤
│          │                                 │
│ SideBar  │         MainLayout              │
│          │                                 │
│ ┌──────┐ │    ┌─────────────────────┐      │
│ │ درس1 │ │    │   {children}        │      │
│ │ درس2 │ │    │   محتوى الصفحة      │      │
│ │ درس3 │ │    │                     │      │
│ │ ...  │ │    └─────────────────────┘      │
│ └──────┘ │                                 │
│          │    ┌─────────────────────┐      │
│          │    │ Footer [إرسال 📤]   │      │
│          │    └─────────────────────┘      │
├──────────┴─────────────────────────────────┤
│            Snackbar (تنبيهات)               │
└────────────────────────────────────────────┘
```

| المكون | الدور | ملف |
|--------|-------|------|
| **ToolBar** | شريط التطبيق العلوي | `components/ToolBar/ToolBar.tsx` |
| **SideBar** | القائمة الجانبية بالدروس | `components/SideBar/SideBar.tsx` |
| **CustomizedListItem** | عنصر درس قابل للتوسيع | `components/SideBar/CustomizedListItem.tsx` |
| **MenuToolbar** | رأس القائمة الجانبية | `components/SideBar/MenuToolbar.tsx` |
| **MenuFooter** | ذيل القائمة الجانبية | `components/SideBar/MenuFooter.tsx` |
| **Footer** | حقل الإدخال وزر الإرسال | `components/Footer/Footer.tsx` |
| **MainLayout** | التخطيط المشترك | `layouts/MainLayout.tsx` |

---

## 2. ToolBar — شريط التطبيق

الشريط العلوي يحتوي على: زر القائمة (للشاشات الصغيرة)، اسم التطبيق، وزر تبديل المظهر.

```typescript
'use client';

import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeMode } from '@/app/hooks/useThemeMode';
import { useAppContext } from '@/app/hooks/useAppContext';
import { APP_NAME } from '@/app/config';

export default function ToolBar() {
  const { mode, toggleTheme } = useThemeMode();
  const { setOpenMobile } = useAppContext();

  return (
    <AppBar
      position="fixed"
      sx={{
        // تأثير الزجاج المبلور (glass-morphism)
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255,255,255,0.8)',
      }}
    >
      <Toolbar>
        {/* زر القائمة — يظهر فقط في الشاشات الصغيرة */}
        <IconButton
          onClick={() => setOpenMobile(true)}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* اسم التطبيق */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {APP_NAME}
        </Typography>

        {/* زر تبديل المظهر */}
        <IconButton onClick={toggleTheme}>
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
```

### تأثير Glass-morphism:

| الخاصية | القيمة | التأثير |
|---------|--------|--------|
| `backdropFilter` | `blur(10px)` | يضبب ما خلف الشريط |
| `backgroundColor` | `rgba(255,255,255,0.8)` | خلفية شبه شفافة |

---

## 3. SideBar — القائمة الجانبية

تعمل بنمطين: **دائمة** على الشاشات الكبيرة، و**منزلقة** على الشاشات الصغيرة.

```typescript
'use client';

import { Drawer, Box } from '@mui/material';
import { useAppContext } from '@/app/hooks/useAppContext';
import { LESSONS } from '@/app/config';
import CustomizedListItem from './CustomizedListItem';
import MenuToolbar from './MenuToolbar';
import MenuFooter from './MenuFooter';

export default function SideBar() {
  const { openMobile, setOpenMobile, drawerWidth } = useAppContext();

  const drawerContent = (
    <Box>
      <MenuToolbar />
      {/* عرض كل درس كعنصر قابل للتوسيع */}
      {LESSONS.map((lesson) => (
        <CustomizedListItem
          key={lesson.slug}
          lectureName={lesson.nameAr}    {/* اسم الدرس بالعربية */}
          lectureSlug={lesson.slug}      {/* الـ slug للمسار */}
        />
      ))}
      <MenuFooter />
    </Box>
  );

  return (
    <>
      {/* Drawer للشاشات الصغيرة (mobile) — ينزلق من الجانب */}
      <Drawer
        variant="temporary"
        open={openMobile}
        onClose={() => setOpenMobile(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {drawerContent}
      </Drawer>

      {/* Drawer للشاشات الكبيرة (desktop) — دائم */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
```

---

## 4. CustomizedListItem — عنصر الدرس

كل درس يتوسع ليُظهر 4 أقسام (شرح، أسئلة، محادثة، ترجمة):

```typescript
import { useState } from 'react';
import {
  Divider, List, ListItem, ListItemButton,
  ListItemText, Collapse, ListItemIcon,
} from '@mui/material';                           // مكونات MUI للقائمة
import {
  ExpandLess, ExpandMore,
  CastForEducation as CastForEducationIcon,       // أيقونة المحاضرة
  QuestionAnswer as QuestionAnswerIcon,            // أيقونة الأسئلة
  RecordVoiceOver as RecordVoiceOverIcon,          // أيقونة المحادثة
  Translate as TranslateIcon,                      // أيقونة الترجمة
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';       // للتنقل بين الصفحات
import { useAppContext } from '@/app/hooks/useAppContext'; // لإغلاق القائمة على الموبايل
import { LESSON_SECTIONS } from '@/app/config';     // أسماء الأقسام العربية
import type { LessonSection } from '@/app/types';

// خريطة أيقونات لكل قسم — تعطي كل عنصر أيقونة مميزة
const sectionIcons: Record<LessonSection, React.ReactElement> = {
  lecture: <CastForEducationIcon />,
  question: <QuestionAnswerIcon />,
  conversation: <RecordVoiceOverIcon />,
  translate: <TranslateIcon />,
};

// الخصائص: اسم الدرس بالعربية والـ slug للمسار
interface CustomizedListItemProps {
  lectureName: string;    // "المضارع البسيط"
  lectureSlug: string;    // "Simple-present"
}

export default function CustomizedListItem({ lectureName, lectureSlug }: CustomizedListItemProps) {
  const [open, setOpen] = useState(false);          // حالة التوسيع/الطي
  const router = useRouter();                       // للتنقل برمجيًا
  const { setOpenMobile } = useAppContext();        // لإغلاق القائمة عند الضغط

  // تحويل الأقسام لمصفوفة [key, label]
  const sections = Object.entries(LESSON_SECTIONS) as [LessonSection, string][];

  return (
    <>
      {/* العنصر الرئيسي — اسم الدرس */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setOpen(!open)}>
          <ListItemText primary={lectureName} primaryTypographyProps={{ fontSize: '14px' }} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>

      {/* الأقسام الفرعية — تظهر عند التوسيع */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        {sections.map(([key, label]) => (
          <div key={key}>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}               {/* مسافة بادئة للعناصر الفرعية */}
                onClick={() => {
                  setOpen(true);              {/* الإبقاء على التوسيع */}
                  setOpenMobile(false);       {/* ⭐ إغلاق القائمة على الموبايل */}
                  router.push(`/${lectureSlug}/${key}`); {/* التنقل للصفحة */}
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {sectionIcons[key]}         {/* الأيقونة المناسبة للقسم */}
                </ListItemIcon>
                <ListItemText primary={label} primaryTypographyProps={{ fontSize: '13px' }} />
              </ListItemButton>
            </List>
            <Divider variant="inset" />      {/* خط فاصل بين الأقسام */}
          </div>
        ))}
      </Collapse>
    </>
  );
}
```

### لماذا `setOpenMobile(false)`؟

على الشاشات الصغيرة، القائمة الجانبية تظهر كشريحة منزلقة (`variant="temporary"`). بدون هذا السطر، القائمة تبقى مفتوحة بعد الضغط على قسم — وهذا سلوك غير متوقع على الهاتف.

### مثال على المسارات المُولَّدة:

```
/Simple-present/lecture      → شرح المضارع البسيط
/Simple-present/question     → أسئلة المضارع البسيط
/Simple-present/conversation → محادثة المضارع البسيط
/Simple-present/translate    → ترجمة المضارع البسيط
```

---

## 5. Footer — حقل الإدخال

المنطقة السفلية حيث يكتب المستخدم سؤاله أو إجابته:

```typescript
'use client';

import { Box, TextField, IconButton, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAppContext } from '@/app/hooks/useAppContext';

export default function Footer({ onSend }: { onSend?: () => void }) {
  const {
    messageValue, setMessageValue,
    textButton, showFooterButton,
  } = useAppContext();

  return (
    <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="اكتب سؤالك هنا..."
        value={messageValue}
        onChange={(e) => setMessageValue(e.target.value)}
      />
      {showFooterButton && (
        <IconButton onClick={onSend} color="primary">
          <SendIcon />
        </IconButton>
      )}
    </Box>
  );
}
```

---

## 6. MainLayout — التخطيط المشترك

يجمع كل المكونات ويضيف تأثيرات الانتقال والتنبيهات:

```typescript
'use client';

import { Box, Fade, Snackbar, Alert } from '@mui/material';
import ToolBar from '@/app/components/ToolBar/ToolBar';
import SideBar from '@/app/components/SideBar/SideBar';
import Footer from '@/app/components/Footer/Footer';
import { useAppContext } from '@/app/hooks/useAppContext';

export default function MainLayout({
  children,
  onSend,
}: {
  children: React.ReactNode;
  onSend?: () => void;
}) {
  const { drawerWidth, showAlert, setShowAlert, errorMessage } = useAppContext();

  return (
    <Box>
      <ToolBar />
      <SideBar />

      {/* المنطقة الرئيسية — تتزحزح بمقدار عرض SideBar */}
      <Box
        component="main"
        sx={{
          ml: { md: `${drawerWidth}px` },
          mt: '64px', // ارتفاع ToolBar
        }}
      >
        {/* تأثير ظهور تدريجي */}
        <Fade in timeout={500}>
          <Box>{children}</Box>
        </Fade>

        <Footer onSend={onSend} />
      </Box>

      {/* تنبيه الأخطاء */}
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
    </Box>
  );
}
```

| العنصر | الوظيفة |
|--------|---------|
| `Fade` | تأثير ظهور تدريجي عند تحميل المحتوى |
| `Snackbar` | شريط تنبيه مؤقت يظهر من الأسفل |
| `ml: drawerWidth` | إزاحة المحتوى بمقدار عرض القائمة الجانبية |
| `mt: 64px` | إزاحة المحتوى تحت شريط التطبيق |

---

## 7. خلاصة

| المفهوم | ما تعلمناه |
|---------|-----------|
| `AppBar` | شريط تطبيق ثابت مع glass-morphism |
| `Drawer` | قائمة جانبية بنمطين: temporary + permanent |
| `Collapse` | تأثير توسيع/طي لعناصر القائمة |
| `Link` (Next.js) | تنقل بدون إعادة تحميل الصفحة |
| `useRouter` | تنقل برمجي (router.push) |
| `setOpenMobile` | إغلاق القائمة على الموبايل عند التنقل |
| `sectionIcons` | أيقونات مميزة لكل قسم دراسي |
| `Fade` | تأثير ظهور تدريجي |
| `Snackbar` | عرض تنبيهات مؤقتة للمستخدم |
| Responsive Design | `display: { xs: 'block', md: 'none' }` |

---

*الدرس 4 من 6 — [← إدارة الحالة](./03-state-management.md) | [الصفحات الديناميكية →](./05-dynamic-pages.md)*
