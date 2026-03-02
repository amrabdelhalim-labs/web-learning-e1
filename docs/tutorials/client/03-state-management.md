# الدرس الثالث: إدارة الحالة — Context و Custom Hooks 🔄

> **هدف الدرس:** فهم كيف نُدير حالة التطبيق المشتركة باستخدام نمط Context + Provider + Custom Hook

---

## 1. لماذا نحتاج إدارة حالة مركزية؟

تخيل أن لديك **لوحة تحكم مركزية** في مبنى: بدلاً من أن يكون لكل غرفة تحكم منفصل بالإضاءة والتكييف، لوحة واحدة تتحكم بالكل وكل غرفة تطّلع على حالتها.

بدون Context: كل مكون يحتاج بياناته يجب أن نمررها من الأعلى عبر كل الطبقات (Prop Drilling).

```
❌ بدون Context:
App → Layout → SideBar → ListItem → props → props → props

✅ مع Context:
App → Context.Provider
        ├── Layout يقرأ مباشرة
        ├── SideBar يقرأ مباشرة
        └── Footer يقرأ مباشرة
```

---

## 2. سياق التطبيق (`AppContext.tsx`)

يدير كل الحالة المشتركة بين المكونات:

```typescript
'use client';

import { createContext, useState, useCallback } from 'react';
import { DRAWER_WIDTH } from '@/app/config';
import type { ChatMessage, ApiResponse, ChatCompletionData, AppContextState } from '@/app/types';

// إنشاء السياق
export const AppContext = createContext<AppContextState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // حالة القائمة الجانبية (للشاشات الصغيرة)
  const [openMobile, setOpenMobile] = useState(false);

  // حالة المحادثة
  const [messageValue, setMessageValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [contextPreviousMessage, setContextPreviousMessage] = useState<ChatMessage[]>([]);

  // حالة التنبيهات
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // حالة زر الـ Footer
  const [textButton, setTextButton] = useState('إرسال');
  const [showFooterButton, setShowFooterButton] = useState(true);

  // معالجة استجابة المحادثة
  const handleChatResponse = useCallback(
    (response: ApiResponse<ChatCompletionData>, userContent: string): boolean => {
      if (response.status === 200 && response.data.content) {
        // نجاح — أضف رسالتي المستخدم والمساعد
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: userContent },
          { role: response.data.role, content: response.data.content },
        ]);
        return true;
      }
      // فشل — أظهر التنبيه
      setErrorMessage((response.data as any).error || 'حدث خطأ');
      setShowAlert(true);
      return false;
    },
    []
  );

  // مسح الرسائل
  const clearMessages = useCallback(() => {
    setMessages([]);
    setContextPreviousMessage([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        openMobile, setOpenMobile,
        drawerWidth: DRAWER_WIDTH,
        messageValue, setMessageValue,
        contextPreviousMessage, setContextPreviousMessage,
        messages, setMessages,
        handleChatResponse, clearMessages,
        showAlert, setShowAlert,
        errorMessage, setErrorMessage,
        textButton, setTextButton,
        showFooterButton, setShowFooterButton,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
```

### جدول الحالة:

| الحالة | النوع | الوصف | أين تُستخدم |
|--------|-------|-------|------------|
| `openMobile` | `boolean` | القائمة الجانبية مفتوحة؟ | SideBar, ToolBar |
| `messages` | `ChatMessage[]` | رسائل المحادثة الحالية | الصفحات الديناميكية |
| `contextPreviousMessage` | `ChatMessage[]` | سياق المحادثة (system prompt) | الصفحات الديناميكية |
| `messageValue` | `string` | نص حقل الإدخال | Footer |
| `showAlert` | `boolean` | هل يُظهر تنبيه خطأ؟ | MainLayout (Snackbar) |
| `errorMessage` | `string` | نص رسالة الخطأ | MainLayout |
| `textButton` | `string` | نص زر الإرسال | Footer |
| `showFooterButton` | `boolean` | إظهار/إخفاء زر الإرسال | Footer |

---

## 3. لماذا `useCallback`؟

```typescript
// بدون useCallback — تُنشأ دالة جديدة عند كل render
const handleChatResponse = (response, userContent) => { ... };

// مع useCallback — تبقى نفس الدالة ما لم تتغير المدخلات
const handleChatResponse = useCallback((response, userContent) => { ... }, []);
```

التشبيه: `useCallback` مثل **بطاقة هوية** — بدلاً من طباعة بطاقة جديدة كل يوم، نستخدم نفس البطاقة حتى تنتهي صلاحيتها.

| بدون `useCallback` | مع `useCallback` |
|--------------------|-----------------|
| دالة جديدة كل render | نفس المرجع |
| المكونات الفرعية تعاد | المكونات لا تعاد بدون داعٍ ✅ |
| أداء أبطأ | أداء أفضل ✅ |

---

## 4. الخطاف المخصص (`useAppContext`)

```typescript
'use client';

import { useContext } from 'react';
import { AppContext } from '@/app/context/AppContext';
import type { AppContextState } from '@/app/types';

export function useAppContext(): AppContextState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
```

### لماذا خطاف مخصص وليس `useContext` مباشرة؟

| `useContext(AppContext)` مباشرة | `useAppContext()` |
|-------------------------------|------------------|
| يمكن أن يُعيد `null` | مضمون أنه يعيد قيمة ✅ |
| لا رسالة خطأ واضحة | خطأ واضح إذا استُخدم خارج Provider ✅ |
| يحتاج استيراد السياق | استيراد واحد فقط ✅ |
| يكرر الكود | DRY — لا تكرار ✅ |

### الاستخدام:

```typescript
// في أي مكون داخل AppProvider:
function Footer() {
  const { messageValue, setMessageValue, textButton } = useAppContext();

  return (
    <TextField
      value={messageValue}
      onChange={(e) => setMessageValue(e.target.value)}
    />
  );
}
```

---

## 5. تسلسل المزودين الكامل

```
RootLayout (layout.tsx)
  └── Providers (providers.tsx)
        └── ThemeProviderWrapper     ← يوفر: mode, toggleTheme
              └── CacheProvider      ← RTL support
                    └── ThemeProvider ← ألوان MUI
                          └── AppProvider      ← يوفر: messages, drawer, alerts...
                                └── {children} ← كل الصفحات والمكونات
```

**قاعدة ذهبية:** المزود الذي يعتمد على مزود آخر يجب أن يكون **داخله**. المظهر لا يعتمد على شيء فيأتي أولاً.

---

## 6. خلاصة

| المفهوم | ما تعلمناه |
|---------|-----------|
| React Context | مشاركة الحالة بين المكونات بدون Prop Drilling |
| Provider Pattern | تغليف المكونات بمزود يوفر البيانات |
| Custom Hook | خطاف مخصص مع حماية من null ورسالة خطأ واضحة |
| `useCallback` | تثبيت مرجع الدالة لتحسين الأداء |
| `'use client'` | تعليمة Next.js لتمييز المكونات التي تستخدم حالة |
| ترتيب المزودين | الخارجي لا يعتمد على الداخلي |

---

*الدرس 3 من 6 — [← نظام المظهر](./02-theme-system.md) | [المكونات →](./04-components.md)*
