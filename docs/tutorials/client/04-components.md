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
        <CustomizedListItem key={lesson.slug} lesson={lesson} />
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
import { List, ListItemButton, ListItemText, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Link from 'next/link';
import { LESSON_SECTIONS } from '@/app/config';
import type { LessonItem } from '@/app/types';

export default function CustomizedListItem({ lesson }: { lesson: LessonItem }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* العنصر الرئيسي — اسم الدرس */}
      <ListItemButton onClick={() => setOpen(!open)}>
        <ListItemText primary={lesson.nameAr} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      {/* الأقسام الفرعية — تظهر عند التوسيع */}
      <Collapse in={open}>
        <List>
          {Object.entries(LESSON_SECTIONS).map(([key, nameAr]) => (
            <ListItemButton
              key={key}
              component={Link}
              href={`/${lesson.slug}/${key}`}
            >
              <ListItemText primary={nameAr} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
}
```

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
| `Fade` | تأثير ظهور تدريجي |
| `Snackbar` | عرض تنبيهات مؤقتة للمستخدم |
| Responsive Design | `display: { xs: 'block', md: 'none' }` |

---

*الدرس 4 من 6 — [← إدارة الحالة](./03-state-management.md) | [الصفحات الديناميكية →](./05-dynamic-pages.md)*
